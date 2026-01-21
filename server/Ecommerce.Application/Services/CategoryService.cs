using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ecommerce.Application.DTOs;
using Ecommerce.Application.Interfaces;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IRepository<Category> _categoryRepository;
        private readonly IRepository<SubCategory> _subCategoryRepository;

        public CategoryService(IRepository<Category> categoryRepository, IRepository<SubCategory> subCategoryRepository)
        {
            _categoryRepository = categoryRepository;
            _subCategoryRepository = subCategoryRepository;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();
            return categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ImageUrl = c.ImageUrl
            });
        }

        public async Task<CategoryDto?> GetCategoryByIdAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null) return null;
            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                ImageUrl = category.ImageUrl
            };
        }

        public async Task<CategoryDto> CreateCategoryAsync(CategoryDto categoryDto)
        {
            var category = new Category
            {
                Name = categoryDto.Name,
                Description = categoryDto.Description,
                ImageUrl = categoryDto.ImageUrl
            };
            await _categoryRepository.AddAsync(category);
            await _categoryRepository.SaveChangesAsync();
            categoryDto.Id = category.Id;
            return categoryDto;
        }

        public async Task UpdateCategoryAsync(CategoryDto categoryDto)
        {
            var category = await _categoryRepository.GetByIdAsync(categoryDto.Id);
            if (category != null)
            {
                category.Name = categoryDto.Name;
                category.Description = categoryDto.Description;
                category.ImageUrl = categoryDto.ImageUrl;
                category.UpdatedAt = DateTime.UtcNow;
                _categoryRepository.Update(category);
                await _categoryRepository.SaveChangesAsync();
            }
        }

        public async Task DeleteCategoryAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category != null)
            {
                category.IsDeleted = true;
                _categoryRepository.Update(category);
                await _categoryRepository.SaveChangesAsync();
            }
        }

        public async Task<SubCategoryDto> CreateSubCategoryAsync(SubCategoryDto subCategoryDto)
        {
            var subCategory = new SubCategory
            {
                Name = subCategoryDto.Name,
                CategoryId = subCategoryDto.CategoryId
            };
            await _subCategoryRepository.AddAsync(subCategory);
            await _subCategoryRepository.SaveChangesAsync();
            subCategoryDto.Id = subCategory.Id;
            return subCategoryDto;
        }
    }
}
