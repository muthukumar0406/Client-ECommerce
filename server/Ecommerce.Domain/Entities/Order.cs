using System;
using System.Collections.Generic;
using Ecommerce.Domain.Enums;

namespace Ecommerce.Domain.Entities
{
    public class Order : BaseEntity
    {
        public string OrderNumber { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        
        public decimal TotalAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal ShippingAmount { get; set; }
        public decimal FinalAmount { get; set; }
        
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public string? TrackingNumber { get; set; }
        
        public int AddressId { get; set; }
        public virtual Address Address { get; set; } = null!;
        
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
