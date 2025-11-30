# MedApp Backend

This repository contains the backend for MedApp, a small ASP.NET Core Web API using SQLite and Entity Framework Core.

**Quick summary**
- **API project:** `MedApp.Api` (Web API, controllers, middleware)
- **Domain & DTOs:** `MedApp.Core` (entities, DTOs, interfaces)
- **Persistence:** `MedApp.Infrastructure` (EF Core `AppDbContext`, repositories, migrations)
- **Business logic:** `MedApp.Services` (services such as `UserService`, `JwtService`)

**Why this structure?**
This layered approach separates concerns: core types and interfaces are independent, infrastructure handles data access, services implement business rules and tokens, and the API project exposes HTTP endpoints.

**Architecture / Request Flow**
- **Incoming request**: hits one of the controllers in `MedApp.Api/Controllers`.
- **Controller**: validates input and calls a service in `MedApp.Services` (for example `UserService`).
- **Service**: contains business logic; calls repository interfaces from `MedApp.Core.Interfaces`.
- **Repository (Infrastructure)**: concrete implementations live in `MedApp.Infrastructure/Repositories` and use `AppDbContext` (EF Core) to read/write to SQLite.
- **Auth flow** (Google login example):
  - Controller receives Google ID token and calls `GoogleJsonWebSignature.ValidateAsync`.
  - `UserService` creates or retrieves a `User` via `UserRepository`.
  - `JwtService` (in `MedApp.Services`) generates a JWT token.
- **Global exception handling**: unhandled exceptions are caught by `ExceptionHandlingMiddleware` (registered in `Program.cs`) which logs to `Logs/errors-YYYY-MM-DD.log` and returns a JSON 500 response.

**Prerequisites**
- .NET SDK 8.0 installed: `https://dotnet.microsoft.com/en-us/download/dotnet/8.0`
- (Optional) `dotnet-ef` tool to run EF migrations: `dotnet tool install --global dotnet-ef`.

**Getting started (development)**
1. Clone the repo and open the workspace at `MedAppBackend`.
2. Restore and build:

```powershell
dotnet restore
dotnet build
```

3. Configure connection string and JWT key: edit `MedApp.Api/appsettings.Development.json` or `appsettings.json`.

Example `appsettings.json` snippet:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=medapp.db"
  },
  "Jwt": {
    "Key": "your-very-strong-secret-key"
  }
}
```

4. Apply EF migrations (creates SQLite file and tables):

```powershell
cd MedApp.Infrastructure
dotnet ef database update --project ..\MedApp.Infrastructure\MedApp.Infrastructure.csproj --startup-project ..\MedApp.Api\MedApp.Api.csproj
```

Note: If you don't run migrations, the app will attempt to query tables and you may see `SQLite Error 1: 'no such table: Users'`.

5. Run the API:

```powershell
cd ..\MedApp.Api
dotnet run
```

The API exposes Swagger in Development at `/swagger`.

**Logging & Exceptions**
- Global exception middleware writes human-readable logs to the `Logs` folder in the API app content root.
- Log file naming: `errors-YYYY-MM-DD.log` (UTC date). Each exception is appended with timestamp, request path, remote IP, and full exception stack trace.

If you want different behavior (local timestamps, retention, size-based rolling), consider adding a structured logger such as Serilog.

**Dependency injection**
- Services and repositories are registered in `Program.cs`:
  - `IUserRepository` -> `UserRepository`
  - `UserService`
  - `JwtService`

**Common commands**
- Build entire solution: `dotnet build`
- Run API: `dotnet run --project MedApp.Api\MedApp.Api.csproj`
- Run EF migrations: see the `dotnet ef` example above

**Troubleshooting**
- `no such table: Users` — run EF migrations (`dotnet ef database update`) or ensure `Data Source` path is writable and migrations exist in `MedApp.Infrastructure/Migrations`.
- `JwtService` not found / namespace errors — ensure projects are referenced in `MedApp.Api.csproj` and `MedApp.Services.csproj`.


---
Small note: this README focuses on developer setup and the overall flow/architecture. 
