using HttpMultipartParser;

namespace KowmalApp.Services;

public interface IStaticWebBlobClient
{
    Task<string> UploadFile(string path, FilePart file);
    Task<List<T>?> GetDbContent<T>(string path) where T : class;
    Task UpdateDbContent<T>(string path, List<T> items) where T : class;
}