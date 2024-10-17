using System.Text.Json;
using HttpMultipartParser;

namespace KowmalApp.Services;

public class LocalBlobClient : IStaticWebBlobClient
{
    public async Task<string> UploadFile(string path, FilePart file)
    {
        await using var stream = file.Data;
        await using FileStream fileStream = new FileStream(path, FileMode.Create, FileAccess.Write);

        await stream.CopyToAsync(fileStream);

        return path;
    }

    public async Task<List<T>?> GetDbContent<T>(string path) where T : class
    {
        string jsonString = await File.ReadAllTextAsync(path);
        
        return JsonSerializer.Deserialize<List<T>>(jsonString);
    }

    public async Task UpdateDbContent<T>(string path, List<T> items) where T : class
    {
        string updatedJsonString = JsonSerializer.Serialize(items, new JsonSerializerOptions { WriteIndented = true });
        
        await File.WriteAllTextAsync(path, updatedJsonString);
    }
}