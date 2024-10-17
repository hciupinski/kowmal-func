using System.Text.Json;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Azure.Storage.Blobs;
using KowmalApp.Services;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(services =>
    {
        // Register BlobServiceClient
        services.AddSingleton(_ =>
            new BlobServiceClient(Environment.GetEnvironmentVariable("AzureWebJobsStorage")));

        #if DEBUG
            services.AddScoped<IStaticWebBlobClient, LocalBlobClient>();
        #else 
            services.AddScoped<IStaticWebBlobClient, StaticWebBlobClient>();
        #endif
        
        services.Configure<JsonSerializerOptions>(options =>
        {
            options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            options.WriteIndented = true;
        });
    })
    .Build();

host.Run();