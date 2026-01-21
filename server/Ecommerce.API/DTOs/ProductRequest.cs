using Microsoft.AspNetCore.Http;

namespace Ecommerce.API.DTOs
{
    public class ProductRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public int StockQuantity { get; set; }
        public string Sku { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public IFormFile? Image { get; set; }
        public int? Id { get; set; } // For Update
    }
}
