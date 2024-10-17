using System.Text.Json;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Azure.Storage.Blobs;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(services =>
    {
        // Register BlobServiceClient
        services.AddSingleton(_ =>
            new BlobServiceClient(Environment.GetEnvironmentVariable("AzureWebJobsStorage")));
        
        services.Configure<JsonSerializerOptions>(options =>
        {
            options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            options.WriteIndented = true;
        });
    })
    .Build();

host.Run();