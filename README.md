# JK Mart - Enterprise E-Commerce Platform

A production-ready e-commerce platform built with .NET 8, Clean Architecture, and Angular 18.

## 🏗️ Architecture
The project follows **Clean Architecture** principles:
- **Domain**: Core entities and business logic.
- **Application**: DTOs, interfaces, and services.
- **Infrastructure**: Data access (EF Core), repositories, and external integrations.
- **API**: Controllers and API configuration.
- **WebUI**: Angular frontend.

## 🚀 Tech Stack
- **Backend**: ASP.NET Core Web API, Entity Framework Core, SQL Server.
- **Frontend**: Angular, SCSS, RxJS, Angular Animations.
- **DevOps**: Docker, Docker Compose.

## 🛠️ Setup Instructions

### Prerequisites
- Docker & Docker Compose

### Running the Project
1. Clone the repository to your server at `160.187.68.165`.
2. Navigate to the root folder.
3. Run the following command:
   ```bash
   docker-compose up --build
   ```
4. Access the applications:
   - **Frontend**: [http://160.187.68.165:3000](http://160.187.68.165:3000)
   - **API Swagger**: [http://160.187.68.165:5001/swagger](http://160.187.68.165:5001/swagger)

## 🔐 Admin Credentials
- **Username**: Muthukumar
- **Password**: Admin@kumar

## 🌐 Network Configuration
- **Server IP**: 160.187.68.165
- **Frontend Port**: 3000
- **Backend API Port**: 5001
- **Direct API Access**: Angular is configured to communicate directly with port 5001.

## 🛒 Features
- **User Side**: Home, Product Listing, Search, Cart, Checkout.
- **Admin Side**: Product Management, Category Management, Order Management.
- **System**: Dockerized, SQL Server, Clean Architecture, Responsive Design.

## 📁 Directory Structure
- `/server`: .NET Source Code
- `/client`: Angular Source Code
- `docker-compose.yml`: Orchestration
