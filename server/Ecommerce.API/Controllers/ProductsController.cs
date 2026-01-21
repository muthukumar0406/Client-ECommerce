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
            var pDto = new ProductDto
            {
                Name = productRequest.Name,
                Description = productRequest.Description,
                Price = productRequest.Price,
                DiscountPrice = productRequest.DiscountPrice,
                StockQuantity = productRequest.StockQuantity,
                Sku = productRequest.Sku,
                CategoryId = productRequest.CategoryId,
                SubCategoryId = productRequest.SubCategoryId
            };

            if (productRequest.Image != null && productRequest.Image.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(productRequest.Image.FileName);
                var uploadsFolder = Path.Combine(_env.WebRootPath, "images/products");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                var filePath = Path.Combine(uploadsFolder, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await productRequest.Image.CopyToAsync(stream);
                }
                var displayUrl = $"http://160.187.68.165:5001/images/products/{fileName}";
                pDto.ImageUrls = new List<string> { displayUrl };
            }

            var result = await _productService.CreateProductAsync(pDto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] DTOs.ProductRequest productRequest)
        {
             var pDto = new ProductDto
            {
                Id = id,
                Name = productRequest.Name,
                Description = productRequest.Description,
                Price = productRequest.Price,
                DiscountPrice = productRequest.DiscountPrice,
                StockQuantity = productRequest.StockQuantity,
                CategoryId = productRequest.CategoryId,
                SubCategoryId = productRequest.SubCategoryId
            };

            if (productRequest.Image != null && productRequest.Image.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(productRequest.Image.FileName);
                var uploadsFolder = Path.Combine(_env.WebRootPath, "images/products");
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _productService.DeleteProductAsync(id);
            return NoContent();
        }
    }
}
