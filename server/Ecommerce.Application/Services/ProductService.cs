using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ecommerce.Application.DTOs;
using Ecommerce.Application.Interfaces;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IRepository<Product> _productRepository;

        public ProductService(IRepository<Product> productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await _productRepository.GetAllAsync();
            return products.Select(p => MapToDto(p));
        }

        public async Task<ProductDto?> GetProductByIdAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            return product != null ? MapToDto(product) : null;
        }

        public async Task<IEnumerable<ProductDto>> SearchProductsAsync(string query)
        {
            var products = await _productRepository.FindAsync(p => 
                p.Name.Contains(query) || p.Description.Contains(query));
            return products.Select(p => MapToDto(p));
        }

        public async Task<ProductDto> CreateProductAsync(ProductDto productDto)
        {
            var product = new Product
            {
                Name = productDto.Name,
                Description = productDto.Description,
                Price = productDto.Price,
                DiscountPrice = productDto.DiscountPrice,
                StockQuantity = productDto.StockQuantity,
                Sku = productDto.Sku,
                CategoryId = productDto.CategoryId,
                SubCategoryId = productDto.SubCategoryId,
                IsEnabled = true
            };

            await _productRepository.AddAsync(product);
            await _productRepository.SaveChangesAsync();
            
            productDto.Id = product.Id;
            return productDto;
        }

        public async Task UpdateProductAsync(ProductDto productDto)
        {
            var product = await _productRepository.GetByIdAsync(productDto.Id);
            if (product != null)
            {
                product.Name = productDto.Name;
                product.Description = productDto.Description;
                product.Price = productDto.Price;
                product.DiscountPrice = productDto.DiscountPrice;
                product.StockQuantity = productDto.StockQuantity;
                product.CategoryId = productDto.CategoryId;
                product.SubCategoryId = productDto.SubCategoryId;
                product.UpdatedAt = DateTime.UtcNow;

                _productRepository.Update(product);
                await _productRepository.SaveChangesAsync();
            }
        }

        public async Task DeleteProductAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product != null)
            {
                product.IsDeleted = true;
                _productRepository.Update(product);
                await _productRepository.SaveChangesAsync();
            }
        }

        private ProductDto MapToDto(Product p)
        {
            return new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                DiscountPrice = p.DiscountPrice,
                StockQuantity = p.StockQuantity,
                Sku = p.Sku,
                CategoryId = p.CategoryId,
                SubCategoryId = p.SubCategoryId,
                AverageRating = p.AverageRating
                // ImageUrls logic would go here
            };
        }
    }
}
