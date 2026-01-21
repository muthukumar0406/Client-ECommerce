namespace Ecommerce.Domain.Entities
{
    public class SubCategory : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public virtual Category Category { get; set; } = null!;
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
