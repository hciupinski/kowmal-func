namespace KowmalApp.Models;

public class ProductsStore
{
    public List<ProductDetails> Products { get; set; } = new List<ProductDetails>();
    public DateTime UpdatedAt { get; set; }
}