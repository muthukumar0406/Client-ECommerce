using System;
using Ecommerce.Domain.Enums;

namespace Ecommerce.Domain.Entities
{
    public class Payment : BaseEntity
    {
        public int OrderId { get; set; }
        public virtual Order Order { get; set; } = null!;

        public string? RazorpayPaymentId { get; set; }
        public string? RazorpayOrderId { get; set; }
        public string? RazorpaySignature { get; set; }

        public PaymentMode PaymentMode { get; set; }
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
