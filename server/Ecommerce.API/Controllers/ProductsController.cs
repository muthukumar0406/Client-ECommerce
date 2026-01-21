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
        public async Task<IActionResult> Create([FromForm] Ecommerce.Application.DTOs.CreateProductDto productDto)
        {
            // Manual mapping to ProductDto for service
            var pDto = new ProductDto
            {
                Name = productDto.Name,
                Description = productDto.Description,
                Price = productDto.Price,
                DiscountPrice = productDto.DiscountPrice,
                StockQuantity = productDto.StockQuantity,
                Sku = productDto.Sku,
                CategoryId = productDto.CategoryId,
                SubCategoryId = productDto.SubCategoryId
            };

            // Handle Image Upload
            if (productDto.Image != null && productDto.Image.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(productDto.Image.FileName);
                var uploadsFolder = Path.Combine(_env.WebRootPath, "images/products");
                
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                
                var filePath = Path.Combine(uploadsFolder, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await productDto.Image.CopyToAsync(stream);
                }

                // Assuming the server is accessed via IP/domain, we construct a relative or absolute URL
                // For Docker/Localhost consistency, we store relative path and let frontend prepend host or return full URL if hostname known
                // Let's store full URL for simplicity if we can, or just relative.
                // ideally: "/images/products/filename.jpg". Frontend prepends API base URL if needed, or we return full.
                
                var displayUrl = $"http://160.187.68.165:5001/images/products/{fileName}";
                pDto.ImageUrls = new List<string> { displayUrl };
            }

            var result = await _productService.CreateProductAsync(pDto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] Ecommerce.Application.DTOs.CreateProductDto productDto)
        {
            // NOTE: For update with file, typically we'd use a different DTO or same. 
            // In Angular, if we send FormData, we need to receive it here.
            // If ID matches...
             
            // Map to ProductDto
             var pDto = new ProductDto
            {
                Id = id,
                Name = productDto.Name,
                Description = productDto.Description,
                Price = productDto.Price,
                DiscountPrice = productDto.DiscountPrice,
                StockQuantity = productDto.StockQuantity,
                CategoryId = productDto.CategoryId,
                SubCategoryId = productDto.SubCategoryId
            };

            if (productDto.Image != null && productDto.Image.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(productDto.Image.FileName);
                var uploadsFolder = Path.Combine(_env.WebRootPath, "images/products");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                var filePath = Path.Combine(uploadsFolder, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await productDto.Image.CopyToAsync(stream);
                }
                var displayUrl = $"http://160.187.68.165:5001/images/products/{fileName}";
                pDto.ImageUrls = new List<string> { displayUrl };
            }
            else 
            {
                 // Keep existing images? Service needs logic for this. 
                 // Current simple service overwrites if list is passed? 
                 // We might need to fetch existing to keep images if no new one provided.
                 var existing = await _productService.GetProductByIdAsync(id);
                 if(existing != null) pDto.ImageUrls = existing.ImageUrls;
            }

            await _productService.UpdateProductAsync(pDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _productService.DeleteProductAsync(id);
            return NoContent();
        }
    }
}
