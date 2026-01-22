using Microsoft.AspNetCore.Http;

namespace Ecommerce.API.DTOs
{
    public class ProductRequest
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public int StockQuantity { get; set; }
        public string? Sku { get; set; }
        public int CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public IFormFile? Image { get; set; }
        public string? QuantityUnit { get; set; }
        public int? Id { get; set; } // For Update
    }
}
