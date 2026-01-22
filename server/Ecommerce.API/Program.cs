using Ecommerce.Application.Interfaces;
using Ecommerce.Application.Services;
using Ecommerce.Domain.Entities;
using Ecommerce.Infrastructure.Data;
using Ecommerce.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Ecommerce API", Version = "v1" });
});

// Database Connection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Dependency Injection
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IRepository<SubCategory>, Repository<SubCategory>>(); // Needed for CategoryService
builder.Services.AddScoped<IPaymentService, PaymentService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.WithOrigins("http://160.187.68.165:3000")
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || true) // Enable swagger for demo
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseStaticFiles(); // Enable serving static files
app.UseAuthorization();
app.MapControllers();

// Auto-migrate database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        // context.Database.Migrate(); // Migrations folder missing
        context.Database.EnsureCreated(); // Creates schema if not exists

        // MANUAL SCHEMA UPDATE FOR PAYMENT IMPLEMENTATION
        try {
             var logger = services.GetRequiredService<ILogger<Program>>();
             logger.LogInformation("Checking and applying manual schema updates...");

            // 1. Update Orders Table
            try {
                context.Database.ExecuteSqlRaw(@"
                    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Orders' AND COLUMN_NAME = 'PaymentMode')
                    BEGIN
                        ALTER TABLE Orders ADD PaymentMode int DEFAULT 0 NOT NULL;
                        ALTER TABLE Orders ADD PaymentStatus int DEFAULT 0 NOT NULL;
                    END
                ");
            } catch (Exception ex) { logger.LogError(ex, "Failed to update Orders table schema"); }

            // 2. Create Payments Table
            try {
                context.Database.ExecuteSqlRaw(@"
                    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Payments')
                    BEGIN
                        CREATE TABLE Payments (
                            Id int IDENTITY(1,1) NOT NULL PRIMARY KEY,
                            OrderId int NOT NULL,
                            RazorpayPaymentId nvarchar(max) NULL,
                            RazorpayOrderId nvarchar(max) NULL,
                            RazorpaySignature nvarchar(max) NULL,
                            PaymentMode int NOT NULL,
                            PaymentStatus int NOT NULL,
                            CreatedDate datetime2 NOT NULL,
                            CreatedAt datetime2 NOT NULL DEFAULT GETDATE(),
                            UpdatedAt datetime2 NULL,
                            IsDeleted bit NOT NULL DEFAULT 0,
                            CONSTRAINT FK_Payments_Orders_OrderId FOREIGN KEY (OrderId) REFERENCES Orders (Id) ON DELETE CASCADE
                        );
                        CREATE INDEX IX_Payments_OrderId ON Payments (OrderId);
                    END
                ");
            } catch (Exception ex) { logger.LogError(ex, "Failed to create Payments table"); }
        } catch (Exception ex) {
            // General failure
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
    }
}

app.Run();
