using System.Collections.Generic;

namespace Ecommerce.Domain.Entities
{
    public class Cart : BaseEntity
    {
        public string? GuestId { get; set; } // For tracking guest carts
        public virtual ICollection<CartItem> Items { get; set; } = new List<CartItem>();
    }
}
