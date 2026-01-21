using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Ecommerce.Application.DTOs;
using Ecommerce.Application.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IWebHostEnvironment _env;

        public ProductsController(IProductService productService, IWebHostEnvironment env)
        {
            _productService = productService;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productService.GetAllProductsAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            var products = await _productService.SearchProductsAsync(q);
            return Ok(products);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] DTOs.ProductRequest productRequest)
        {
            try
            {
                if (string.IsNullOrEmpty(productRequest.Name))
                {
                    return BadRequest(new { error = "Product name is required" });
                }

                if (productRequest.CategoryId <= 0)
                {
                    return BadRequest(new { error = "Valid Category ID is required" });
                }

                var pDto = new ProductDto
                {
                    Name = productRequest.Name,
                    Description = productRequest.Description ?? "",
                    Price = productRequest.Price,
                    DiscountPrice = productRequest.DiscountPrice,
                    StockQuantity = productRequest.StockQuantity,
                    Sku = string.IsNullOrEmpty(productRequest.Sku) ? "SKU-" + Guid.NewGuid().ToString().ToUpper().Substring(0, 8) : productRequest.Sku,
                    CategoryId = productRequest.CategoryId,
                    SubCategoryId = productRequest.SubCategoryId
                };

                if (productRequest.Image != null && productRequest.Image.Length > 0)
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(productRequest.Image.FileName);
                    
                    // Safe WebRootPath
                    var rootPath = _env.WebRootPath;
                    if (string.IsNullOrEmpty(rootPath))
                    {
                        rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                    }

                    var uploadsFolder = Path.Combine(rootPath, "images", "products");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                    
                    var filePath = Path.Combine(uploadsFolder, fileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await productRequest.Image.CopyToAsync(stream);
                    }
                    
                    // Use a relative path or fixed IP for now as per previous implementation
                    var displayUrl = $"http://160.187.68.165:5001/images/products/{fileName}";
                    pDto.ImageUrls = new List<string> { displayUrl };
                }

                var result = await _productService.CreateProductAsync(pDto);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, inner = ex.InnerException?.Message, stack = ex.StackTrace });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] DTOs.ProductRequest productRequest)
        {
            try
            {
                var pDto = new ProductDto
                {
                    Id = id,
                    Name = productRequest.Name,
                    Description = productRequest.Description ?? "",
                    Price = productRequest.Price,
                    DiscountPrice = productRequest.DiscountPrice,
                    StockQuantity = productRequest.StockQuantity,
                    CategoryId = productRequest.CategoryId,
                    SubCategoryId = productRequest.SubCategoryId
                };

                if (productRequest.Image != null && productRequest.Image.Length > 0)
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(productRequest.Image.FileName);
                    
                    var rootPath = _env.WebRootPath;
                    if (string.IsNullOrEmpty(rootPath))
                    {
                        rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                    }

                    var uploadsFolder = Path.Combine(rootPath, "images", "products");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                    
                    var filePath = Path.Combine(uploadsFolder, fileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await productRequest.Image.CopyToAsync(stream);
                    }
                    
                    var displayUrl = $"http://160.187.68.165:5001/images/products/{fileName}";
                    pDto.ImageUrls = new List<string> { displayUrl };
                }
                else 
                {
                    var existing = await _productService.GetProductByIdAsync(id);
                    if(existing != null) pDto.ImageUrls = existing.ImageUrls;
                }

                await _productService.UpdateProductAsync(pDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, inner = ex.InnerException?.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _productService.DeleteProductAsync(id);
            return NoContent();
        }
    }
}
