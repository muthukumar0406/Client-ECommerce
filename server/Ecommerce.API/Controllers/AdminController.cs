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
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (request.Username == "Muthukumar" && request.Password == "Admin@kumar")
            {
                return Ok(new { 
                    Token = "fake-jwt-token-for-demo-admin", 
                    Username = "Muthukumar",
                    FullName = "Administrator" 
                });
            }
            
            return Unauthorized("Invalid credentials");
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
