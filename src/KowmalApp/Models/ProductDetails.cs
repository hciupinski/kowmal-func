namespace KowmalApp.Models;

public class ProductDetails
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public List<string> Images { get; set; }
    public string ThumbnailUrl { get; set; }
}