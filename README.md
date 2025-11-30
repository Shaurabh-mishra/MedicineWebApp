# 🏥 MedApp – Medicine Management System  
A full-stack application built using **Angular 17** (frontend) and **.NET 8 Web API** (backend) with modern authentication using **Google OAuth**.  
The system allows users to log in via Google and manage medicines (CRUD operations) with SQLite as the database.

AI Tools Used: Copilot and OpenAPI

---

## 🚀 Features

### 🔐 Authentication
- Google Sign-In (OAuth 2.0)
- JWT-based authentication between Angular & .NET API
- Route guards for protected pages

### 💊 Medicine Management
- Add / Edit / Delete medicines
- Paginated listing
- SQLite database
- Repository + Service + Controller architecture

### 🖥 Frontend (Angular)
- Responsive UI with SCSS
- Google GSI login button
- Dashboard, Medicines list, About page
- Token stored securely in LocalStorage

### ⚙️ Backend (.NET 8 API)
- Layered architecture:
  - **MedApp.Api** – Controllers
  - **MedApp.Core** – Entities & Interfaces
  - **MedApp.Infrastructure** – EF Core, Repositories
  - **MedApp.Services** – Business logic
- Entity Framework Core 8 (SQLite)
- JWT token generation
- Swagger API documentation

---
A separte setup instruction and flow is given inside readme.md file  in BackendAPI and AngularFrontend.

