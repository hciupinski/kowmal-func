using HttpMultipartParser;
using KowmalApp.Helpers;
using KowmalApp.Models;
using KowmalApp.Services.Interfaces;

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
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "UploadProduct")] HttpRequestData req)
    {
        _logger.LogInformation("Processing UploadProduct request.");
        
        // Extract token from Authorization header
        if (!req.Headers.TryGetValues("Authorization", out var authHeaders) || !authHeaders.Any())
        {
            return req.CreateResponse(HttpStatusCode.Unauthorized);
        }

        var bearerToken = authHeaders.First().Split(' ').Last();

        var principal = TokenValidator.ValidateToken(bearerToken);

        if (principal == null)
        {
            return req.CreateResponse(HttpStatusCode.Unauthorized);
        }

        var formData = await MultipartFormDataParser.ParseAsync(req.Body);
        var name = formData.GetParameterValue("name");
        var description = formData.GetParameterValue("description");
        var files = formData.Files;

        if (string.IsNullOrEmpty(name) || !files.Any())
        {
            var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
            await badResponse.WriteStringAsync("Name and images are required.");
            return badResponse;
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

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteStringAsync("Product uploaded successfully.");

        return response;
    }
}