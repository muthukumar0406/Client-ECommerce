namespace Ecommerce.Application.DTOs
{
    public class CreateUpiOrderDto
    {
        public int OrderId { get; set; }
    }

    public class VerifyUpiPaymentDto
    {
        public int OrderId { get; set; }
        public string RazorpayPaymentId { get; set; } = string.Empty;
        public string RazorpayOrderId { get; set; } = string.Empty;
        public string RazorpaySignature { get; set; } = string.Empty;
    }

    public class ConfirmCodDto
    {
        public int OrderId { get; set; }
    }
}
