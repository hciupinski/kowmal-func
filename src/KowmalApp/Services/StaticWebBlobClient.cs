using System.Text.Json;
using Azure.Storage.Blobs;
using HttpMultipartParser;

namespace KowmalApp.Services;

public class StaticWebBlobClient : IStaticWebBlobClient
{
    private BlobContainerClient _container;

    public StaticWebBlobClient(BlobServiceClient blobServiceClient)
    {
        _container = blobServiceClient.GetBlobContainerClient(Environment.GetEnvironmentVariable("BlobContainer"));
    }

    public async Task<string> UploadFile(string path, FilePart file)
    {
        var blobClient = _container.GetBlobClient(path);

        await using (var stream = file.Data)
        {
            await blobClient.UploadAsync(stream);
        }

        return blobClient.Uri.ToString();
    }

    public async Task<List<T>?> GetDbContent<T>(string path) where T : class
    {
        var blobClient = _container.GetBlobClient(path);
        List<T>? products = new List<T>();

        if (await blobClient.ExistsAsync())
        {
            var downloadInfo = await blobClient.DownloadAsync();
            products = await JsonSerializer.DeserializeAsync<List<T>>(downloadInfo.Value.Content);
        }

        return products;
    }

    public async Task UpdateDbContent<T>(string path, List<T> items) where T : class
    {
        var blobClient = _container.GetBlobClient(path);
        var updatedJson = JsonSerializer.Serialize(items);
        using var memoryStream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(updatedJson));
        await blobClient.UploadAsync(memoryStream, overwrite: true);
    }
}