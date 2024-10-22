using Azure.Storage.Blobs;
using HttpMultipartParser;
using KowmalApp.Models;
using KowmalApp.Services.Interfaces;
using Newtonsoft.Json;

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

    public async Task<ProductsStore?> GetDbContent(string path)
    {
        var blobClient = _container.GetBlobClient(path);

        if (await blobClient.ExistsAsync())
        {
            var downloadInfo = await blobClient.DownloadAsync();
            using var streamReader = new StreamReader(downloadInfo.Value.Content);
            var store = await streamReader.ReadToEndAsync();
            return JsonConvert.DeserializeObject<ProductsStore>(store);
        }

        throw new Exception("Store file not found");
    }

    public async Task UpdateDbContent(string path, ProductsStore store)
    {
        var blobClient = _container.GetBlobClient(path);
        var updatedJson = JsonConvert.SerializeObject(store);
        using var memoryStream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(updatedJson));
        await blobClient.UploadAsync(memoryStream, overwrite: true);
    }
}