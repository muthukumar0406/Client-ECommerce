using Microsoft.AspNetCore.Mvc;
using Ecommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var admin = await _context.Admins.FirstOrDefaultAsync(a => 
                a.Username == request.Username && a.PasswordHash == request.Password);
            
            if (admin == null) return Unauthorized("Invalid credentials");

            return Ok(new { 
                Token = "fake-jwt-token-for-demo", 
                Username = admin.Username,
                FullName = admin.FullName 
            });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
