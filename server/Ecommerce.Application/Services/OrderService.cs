using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ecommerce.Application.DTOs;
using Ecommerce.Application.Interfaces;
using Ecommerce.Domain.Entities;
using Ecommerce.Domain.Enums;

namespace Ecommerce.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly Ecommerce.Infrastructure.Data.ApplicationDbContext _context;

        public OrderService(IRepository<Order> orderRepository, IRepository<Product> productRepository, Ecommerce.Infrastructure.Data.ApplicationDbContext context)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _context = context;
        }

        // ... CreateOrderAsync ...

        public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
        {
            // Use _context directly to Include related entities
            var orders = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync(
                Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.Include(
                    _context.Orders.Include("Address").Include("OrderItems"), "Address")
            );
             
            // Proper EF Core Include syntax:
            var fullOrders = await _context.Orders
                .Include(o => o.Address)
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return fullOrders.Select(o => new OrderDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                CustomerName = o.CustomerName,
                CustomerPhone = o.CustomerPhone,
                CustomerEmail = o.CustomerEmail,
                FinalAmount = o.FinalAmount,
                Status = o.Status.ToString(),
                OrderDate = o.CreatedAt,
                // Check for null address just in case
                Items = o.OrderItems.Select(i => new OrderItemDto 
                { 
                    ProductId = i.ProductId,
                    ProductName = "Product " + i.ProductId, // Ideally join product or store name in OrderItem
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                }).ToList()
            });
        }

        public async Task<OrderDto?> GetOrderByIdAsync(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null) return null;
            return new OrderDto
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                CustomerName = order.CustomerName,
                FinalAmount = order.FinalAmount,
                Status = order.Status.ToString(),
                OrderDate = order.CreatedAt
            };
        }

        public async Task UpdateOrderStatusAsync(int orderId, string status)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order != null && Enum.TryParse<OrderStatus>(status, true, out var orderStatus))
            {
                order.Status = orderStatus;
                order.UpdatedAt = DateTime.UtcNow;
                _orderRepository.Update(order);
                await _orderRepository.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<OrderDto>> GetOrdersByEmailAsync(string email)
        {
            var orders = await _orderRepository.FindAsync(o => o.CustomerEmail == email);
            return orders.Select(o => new OrderDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                FinalAmount = o.FinalAmount,
                Status = o.Status.ToString(),
                OrderDate = o.CreatedAt
            });
        }
    }
}
