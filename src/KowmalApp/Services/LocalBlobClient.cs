using HttpMultipartParser;

namespace KowmalApp.Services;

public class LocalBlobClient : IStaticWebBlobClient
{
    public Task<string> UploadFile(string path, FilePart file)
    {
        throw new NotImplementedException();
    }

    public Task<List<T>?> GetDbContent<T>(string path) where T : class
    {
        throw new NotImplementedException();
    }

    public Task UpdateDbContent<T>(string path, List<T> items) where T : class
    {
        throw new NotImplementedException();
    }
}