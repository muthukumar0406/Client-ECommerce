using System.Threading.Tasks;

namespace Ecommerce.Application.Interfaces
{
    public interface IPaymentService
    {
        Task<string> CreateRazorpayOrderAsync(int orderId);
        Task<bool> VerifyRazorpayPaymentAsync(int orderId, string razorpayPaymentId, string razorpayOrderId, string razorpaySignature);
        Task<bool> ConfirmCodOrderAsync(int orderId);
    }
}
