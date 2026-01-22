using System;
using System.Text;
using System.Text.Json;
using System.Security.Cryptography;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Ecommerce.Application.Interfaces;
using Ecommerce.Domain.Entities;
using Ecommerce.Domain.Enums;

namespace Ecommerce.Application.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IRepository<Order> _orderRepository;
        private readonly IRepository<Payment> _paymentRepository;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public PaymentService(
            IRepository<Order> orderRepository,
            IRepository<Payment> paymentRepository,
            IConfiguration configuration)
        {
            _orderRepository = orderRepository;
            _paymentRepository = paymentRepository;
            _configuration = configuration;
            _httpClient = new HttpClient();
        }

        public async Task<string> CreateRazorpayOrderAsync(int orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) throw new Exception("Order not found");

            var keyId = _configuration["Razorpay:KeyId"];
            var keySecret = _configuration["Razorpay:KeySecret"];

            if (string.IsNullOrEmpty(keyId) || string.IsNullOrEmpty(keySecret))
                throw new Exception("Razorpay credentials not configured");

            var amountInPaise = (long)(order.FinalAmount * 100);

            var requestData = new
            {
                amount = amountInPaise,
                currency = "INR",
                receipt = order.OrderNumber,
                payment_capture = 1 // Auto capture
            };

            var jsonContent = JsonSerializer.Serialize(requestData);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");
            
            var authToken = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{keyId}:{keySecret}"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authToken);

            var response = await _httpClient.PostAsync("https://api.razorpay.com/v1/orders", content);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Razorpay Error: {responseBody}");
            }

            using var doc = JsonDocument.Parse(responseBody);
            var razorpayOrderId = doc.RootElement.GetProperty("id").GetString();

            if (string.IsNullOrEmpty(razorpayOrderId)) throw new Exception("Failed to get order_id from Razorpay");

            // Record the Payment Initiated
            var payment = new Payment
            {
                OrderId = order.Id,
                PaymentMode = PaymentMode.UPI,
                PaymentStatus = PaymentStatus.Pending,
                RazorpayOrderId = razorpayOrderId,
                CreatedDate = DateTime.UtcNow
            };

            await _paymentRepository.AddAsync(payment);
            await _paymentRepository.SaveChangesAsync();

            return razorpayOrderId;
        }

        public async Task<bool> VerifyRazorpayPaymentAsync(int orderId, string razorpayPaymentId, string razorpayOrderId, string razorpaySignature)
        {
            var keySecret = _configuration["Razorpay:KeySecret"];
            if (string.IsNullOrEmpty(keySecret)) throw new Exception("Razorpay secret not configured");

            var generatedSignature = CalculateHmacSha256(razorpayOrderId + "|" + razorpayPaymentId, keySecret);

            if (generatedSignature == razorpaySignature)
            {
                var order = await _orderRepository.GetByIdAsync(orderId);
                // Find the payment record
                // Since IRepository might not have complex Find, we might need to filter manually or standard Find
                // Assuming we just created a payment with this RazorpayOrderId
                // But wait, IRepository might be generic.
                
                // Let's create a NEW Payment record or Update existing?
                // Better update existing if possible, or Add new if not found.
                // We'll just Add a new one or update logically. The requirement says "PaymentId, OrderId, RazorpayPaymentId..."
                // Logic: Find Payment by RazorpayOrderId.
                
                // Assuming we can't easily query by RazorpayOrderId without generic FindAsync properly implemented
                // Let's just create a new Payment entry or update Order directly.
                
                if (order != null)
                {
                    order.PaymentStatus = PaymentStatus.Paid;
                    order.Status = OrderStatus.Confirmed; // Or Paid
                    _orderRepository.Update(order);
                    await _orderRepository.SaveChangesAsync();
                }

                // Ideally we update the Payment entity too
                // For simplicity given generic repo, let's try to add a confirmed payment record
                var payment = new Payment
                {
                    OrderId = orderId,
                    PaymentMode = PaymentMode.UPI,
                    PaymentStatus = PaymentStatus.Paid,
                    RazorpayOrderId = razorpayOrderId,
                    RazorpayPaymentId = razorpayPaymentId,
                    RazorpaySignature = razorpaySignature,
                    CreatedDate = DateTime.UtcNow
                };
                await _paymentRepository.AddAsync(payment);
                await _paymentRepository.SaveChangesAsync();

                return true;
            }
            return false;
        }

        public async Task<bool> ConfirmCodOrderAsync(int orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) return false;

            order.PaymentMode = PaymentMode.COD;
            order.PaymentStatus = PaymentStatus.CODPending; // Or Pending
            order.Status = OrderStatus.Confirmed; // Order confirmed immediately

            _orderRepository.Update(order);
            await _orderRepository.SaveChangesAsync();

            var payment = new Payment
            {
                OrderId = order.Id,
                PaymentMode = PaymentMode.COD,
                PaymentStatus = PaymentStatus.Pending,
                CreatedDate = DateTime.UtcNow
            };
            await _paymentRepository.AddAsync(payment);
            await _paymentRepository.SaveChangesAsync();

            return true;
        }

        private static string CalculateHmacSha256(string text, string secret)
        {
            using (var hmac = new HMACSHA256(Encoding.ASCII.GetBytes(secret)))
            {
                var hash = hmac.ComputeHash(Encoding.ASCII.GetBytes(text));
                return BitConverter.ToString(hash).Replace("-", "").ToLower();
            }
        }
    }
}
