using HttpMultipartParser;
using KowmalApp.Helpers;
using KowmalApp.Models;

namespace KowmalApp.Endpoints;

using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Text.Json;
using System.IO;
using System;
using System.Net;
using System.Linq;

public class UploadProduct
{
    private readonly ILogger _logger;
    private readonly BlobServiceClient _blobServiceClient;

    public UploadProduct(ILoggerFactory loggerFactory, BlobServiceClient blobServiceClient)
    {
        _logger = loggerFactory.CreateLogger<UploadProduct>();
        _blobServiceClient = blobServiceClient;
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
        var containerClient = _blobServiceClient.GetBlobContainerClient("products");

        foreach (var file in files)
        {
            var blobClient = containerClient.GetBlobClient($"products/{productId}/{file.FileName}");

            using (var stream = file.Data)
            {
                await blobClient.UploadAsync(stream);
            }

            imageUrls.Add(blobClient.Uri.ToString());
        }

        // Update products.json
        var productsBlobClient = containerClient.GetBlobClient("products.json");
        List<ProductDetails> products = new List<ProductDetails>();

        if (await productsBlobClient.ExistsAsync())
        {
            var downloadInfo = await productsBlobClient.DownloadAsync();
            products = await JsonSerializer.DeserializeAsync<List<ProductDetails>>(downloadInfo.Value.Content);
        }

        var newProduct = new ProductDetails
        {
            Id = productId,
            Name = name,
            Description = description,
            Images = imageUrls,
            ThumbnailUrl = imageUrls.First()
        };

        products.Add(newProduct);

        // Upload updated products list
        var updatedJson = JsonSerializer.Serialize(products);
        using (var memoryStream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(updatedJson)))
        {
            await productsBlobClient.UploadAsync(memoryStream, overwrite: true);
        }

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteStringAsync("Product uploaded successfully.");

        return response;
    }
}