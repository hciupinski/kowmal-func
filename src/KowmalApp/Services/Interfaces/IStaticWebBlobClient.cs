using HttpMultipartParser;
using KowmalApp.Models;

namespace KowmalApp.Services.Interfaces;

public interface IStaticWebBlobClient
{
    Task<string> UploadFile(string path, FilePart file);
    Task<ProductsStore?> GetDbContent(string path);
    Task UpdateDbContent(string path, ProductsStore store);
}