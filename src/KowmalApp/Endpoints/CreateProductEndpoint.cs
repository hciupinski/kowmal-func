using System.IdentityModel.Tokens.Jwt;
using HttpMultipartParser;
using KowmalApp.Models;
using KowmalApp.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace KowmalApp.Endpoints;

using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System;
using System.Net;
using System.Linq;

public class UploadProduct
{
    private readonly ILogger _logger;
    private readonly IStaticWebBlobClient _webBlobClient;

    public UploadProduct(ILoggerFactory loggerFactory, IStaticWebBlobClient webBlobClient)
    {
        _logger = loggerFactory.CreateLogger<UploadProduct>();
        _webBlobClient = webBlobClient;
    }

    [Function("UploadProduct")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "UploadProduct")] HttpRequestData req)
    {
        _logger.LogInformation("Processing UploadProduct request.");
        
        // Extract token from Authorization header
        if (!req.Headers.Contains("Authorization"))
        {
            return new UnauthorizedResult();
        }
        
        // Extract and validate the token (Azure will validate the token for you)
        string token = req.Headers.FirstOrDefault(x => x.Key == "Authorization").Value.First().Replace("Bearer ", "");
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadToken(token) as JwtSecurityToken;
        string email = jwtToken?.Claims.FirstOrDefault(claim => claim.Type == "email")?.Value;

        // List of allowed admin emails
        var allowedEmails = Environment.GetEnvironmentVariable("AllowedEmails").Split(",");
        
        // Check if the user's email is in the allowed list
        if (email == null || !allowedEmails.Contains(email))
        {
            return new UnauthorizedResult();
        }

        var formData = await MultipartFormDataParser.ParseAsync(req.Body);
        var name = formData.GetParameterValue("name");
        var description = formData.GetParameterValue("description");
        var files = formData.Files;

        if (string.IsNullOrEmpty(name) || !files.Any())
        {
            _logger.LogWarning("Name and images are required.");
            return new BadRequestObjectResult("Name and images are required.");
        }

        var productId = Guid.NewGuid().ToString();
        var imageUrls = new List<string>();

        foreach (var file in files)
        {
            var productsPath = $"{Environment.GetEnvironmentVariable("ProductsDir")}/{productId}/{file.FileName}";
            var urlPath = await _webBlobClient.UploadFile(productsPath, file);

            imageUrls.Add(urlPath);
        }

        // Update products.json
        var productsStorePath = $"{Environment.GetEnvironmentVariable("ProductsStorePath")}";
        var productsStore = await _webBlobClient.GetDbContent(productsStorePath);

        if (productsStore == null)
        {
            _logger.LogWarning("Missing store file.");
            throw new Exception($"Cannot access {nameof(ProductsStore)}");
        }

        var newProduct = new ProductDetails
        {
            Id = productId,
            Name = name,
            Description = description,
            Images = imageUrls,
            ThumbnailUrl = imageUrls.First()
        };

        productsStore.Products.Add(newProduct);
        productsStore.UpdatedAt = DateTime.Now;
        
        // Upload updated products list
        await _webBlobClient.UpdateDbContent(productsStorePath, productsStore!);

        return new OkObjectResult("Product uploaded successfully.");
    }
}