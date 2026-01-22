using System.Collections.Generic;

namespace Ecommerce.Domain.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public int StockQuantity { get; set; }
        public string? Sku { get; set; }
        public bool IsEnabled { get; set; } = true;
        public double AverageRating { get; set; }
        public string? QuantityUnit { get; set; }
        
        public int CategoryId { get; set; }
        public virtual Category Category { get; set; } = null!;
        
        public int? SubCategoryId { get; set; }
        public virtual SubCategory? SubCategory { get; set; }
        
        public virtual ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    }
}
