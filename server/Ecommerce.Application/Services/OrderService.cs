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
        private readonly IRepository<Order> _orderRepository;
        private readonly IRepository<Product> _productRepository;

        public OrderService(IRepository<Order> orderRepository, IRepository<Product> productRepository)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
        }

        public async Task<OrderDto> CreateOrderAsync(CreateOrderDto createOrderDto)
        {
            var order = new Order
            {
                OrderNumber = "ORD-" + Guid.NewGuid().ToString().ToUpper().Substring(0, 8),
                CustomerEmail = createOrderDto.CustomerEmail,
                CustomerName = createOrderDto.CustomerName,
                CustomerPhone = createOrderDto.CustomerPhone,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                Address = new Address
                {
                    Street = createOrderDto.ShippingAddress.Street,
                    City = createOrderDto.ShippingAddress.City,
                    State = createOrderDto.ShippingAddress.State,
                    ZipCode = createOrderDto.ShippingAddress.ZipCode,
                    Country = createOrderDto.ShippingAddress.Country
                },
                PaymentMode = createOrderDto.PaymentMode,
                PaymentStatus = PaymentStatus.Pending
            };

            decimal total = 0;
            foreach (var item in createOrderDto.Items)
            {
                var product = await _productRepository.GetByIdAsync(item.ProductId);
                if (product != null)
                {
                    var unitPrice = (product.DiscountPrice.HasValue && product.DiscountPrice.Value > 0) 
                        ? product.DiscountPrice.Value 
                        : product.Price;
                    var itemTotal = unitPrice * item.Quantity;
                    total += itemTotal;

                    order.OrderItems.Add(new OrderItem
                    {
                        ProductId = product.Id,
                        Quantity = item.Quantity,
                        UnitPrice = unitPrice,
                        TotalPrice = itemTotal
                    });

                    // Update stock
                    product.StockQuantity -= item.Quantity;
                    _productRepository.Update(product);
                }
            }

            order.TotalAmount = total;
            order.FinalAmount = total; 

            await _orderRepository.AddAsync(order);
            await _orderRepository.SaveChangesAsync();

            return new OrderDto
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                FinalAmount = order.FinalAmount,
                Status = order.Status.ToString(),
                PaymentMode = order.PaymentMode,
                PaymentStatus = order.PaymentStatus,
                OrderDate = order.CreatedAt
            };
        }

        public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
        {
            var orders = await _orderRepository.GetAllAsync(o => o.Address, o => o.OrderItems);
            // We need to ensure Product is included in OrderItems for names
            // Since our generic repository might not support deep includes nested like o => o.OrderItems.Select(i => i.Product)
            // We'll fetch products separately or use a more advanced repository if needed.
            // For now, let's fetch all products and map.
            var products = await _productRepository.GetAllAsync();
            
            return orders.Select(o => new OrderDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                CustomerName = o.CustomerName,
                CustomerPhone = o.CustomerPhone,
                CustomerEmail = o.CustomerEmail,
                FinalAmount = o.FinalAmount,
                Status = o.Status.ToString(),
                PaymentMode = o.PaymentMode,
                PaymentStatus = o.PaymentStatus,
                OrderDate = o.CreatedAt,
                Address = o.Address != null ? new AddressDto
                {
                    Street = o.Address.Street,
                    City = o.Address.City,
                    State = o.Address.State,
                    ZipCode = o.Address.ZipCode,
                    Country = o.Address.Country
                } : null,
                Items = o.OrderItems.Select(i => new OrderItemDto 
                { 
                    ProductId = i.ProductId,
                    ProductName = products.FirstOrDefault(p => p.Id == i.ProductId)?.Name ?? "Product " + i.ProductId, 
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    QuantityUnit = products.FirstOrDefault(p => p.Id == i.ProductId)?.QuantityUnit ?? ""
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
                PaymentMode = order.PaymentMode,
                PaymentStatus = order.PaymentStatus,
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

        public async Task DeleteOrderAsync(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order != null)
            {
                _orderRepository.Remove(order);
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
