namespace Ecommerce.Domain.Enums
{
    public enum PaymentStatus
    {
        Pending,
        Paid,
        Failed,
        CODPending // For COD before delivery
    }
}
