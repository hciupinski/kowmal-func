using System.Text.Json;
using HttpMultipartParser;
using KowmalApp.Models;
using KowmalApp.Services.Interfaces;

namespace KowmalApp.Services;

public class LocalBlobClient : IStaticWebBlobClient
{
    public async Task<string> UploadFile(string path, FilePart file)
    {
        string? directory = Path.GetDirectoryName(path);
        if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
        {
            Directory.CreateDirectory(directory);
        }
        
        await using var stream = file.Data;
        await using FileStream fileStream = new FileStream(path, FileMode.Create, FileAccess.Write);

        await stream.CopyToAsync(fileStream);

        return path;
    }

    public async Task<ProductsStore?> GetDbContent(string path)
    {
        string jsonString = await File.ReadAllTextAsync(path);
        
        return JsonSerializer.Deserialize<ProductsStore>(jsonString);
    }

    public async Task UpdateDbContent(string path, ProductsStore store)
    {
        string updatedJsonString = JsonSerializer.Serialize(store, new JsonSerializerOptions { WriteIndented = true });
        
        await File.WriteAllTextAsync(path, updatedJsonString);
    }
}