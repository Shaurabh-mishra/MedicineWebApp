using System.Text;
using Microsoft.AspNetCore.Http;

namespace MedApp.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, IWebHostEnvironment env, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _env = env;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception caught by middleware");
            await LogToFileAsync(context, ex);
            await WriteErrorResponseAsync(context, ex);
        }
    }

    private async Task LogToFileAsync(HttpContext context, Exception ex)
    {
        try
        {
            var logsDir = Path.Combine(_env.ContentRootPath, "Logs");
            if (!Directory.Exists(logsDir)) Directory.CreateDirectory(logsDir);

            var fileName = $"errors-{DateTime.UtcNow:yyyy-MM-dd}.log";
            var filePath = Path.Combine(logsDir, fileName);

            var sb = new StringBuilder();
            sb.AppendLine("-------------------------------");
            sb.AppendLine($"Timestamp: {DateTime.UtcNow:O}");
            sb.AppendLine($"Request: {context.Request.Method} {context.Request.Path}{context.Request.QueryString}");
            sb.AppendLine($"RemoteIp: {context.Connection.RemoteIpAddress}");
            sb.AppendLine("Exception:");
            sb.AppendLine(ex.ToString());
            sb.AppendLine();

            await File.AppendAllTextAsync(filePath, sb.ToString());
        }
        catch (Exception fileEx)
        {
            _logger.LogError(fileEx, "Failed to write exception to log file");
        }
    }

    private static async Task WriteErrorResponseAsync(HttpContext context, Exception ex)
    {
        context.Response.Clear();
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";

        var response = new
        {
            error = "An unexpected error occurred.",
            details = ex.Message
        };

        var json = System.Text.Json.JsonSerializer.Serialize(response);
        await context.Response.WriteAsync(json);
    }
}

public static class ExceptionHandlingMiddlewareExtensions
{
    public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder app)
    {
        return app.UseMiddleware<ExceptionHandlingMiddleware>();
    }
}
