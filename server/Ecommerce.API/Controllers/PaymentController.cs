using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ecommerce.Application.DTOs;
using Ecommerce.Application.Interfaces;

namespace Ecommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("create-upi-order")]
        public async Task<IActionResult> CreateUpiOrder([FromBody] CreateUpiOrderDto dto)
        {
            try
            {
                var razorpayOrderId = await _paymentService.CreateRazorpayOrderAsync(dto.OrderId);
                return Ok(new { razorpayOrderId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("verify-upi")]
        public async Task<IActionResult> VerifyUpi([FromBody] VerifyUpiPaymentDto dto)
        {
            try
            {
                var success = await _paymentService.VerifyRazorpayPaymentAsync(
                    dto.OrderId, 
                    dto.RazorpayPaymentId, 
                    dto.RazorpayOrderId, 
                    dto.RazorpaySignature);

                if (success)
                {
                    return Ok(new { message = "Payment verified successfully" });
                }
                return BadRequest(new { message = "Payment verification failed" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("confirm-cod")]
        public async Task<IActionResult> ConfirmCod([FromBody] ConfirmCodDto dto)
        {
            try
            {
                var success = await _paymentService.ConfirmCodOrderAsync(dto.OrderId);
                if (success)
                {
                    return Ok(new { message = "Order confirmed with COD" });
                }
                return BadRequest(new { message = "Order confirmation failed" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
