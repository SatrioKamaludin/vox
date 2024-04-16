using System.Text.Json;
using Vox.Server.Exceptions;

namespace Vox.Server.Middlewares
{
    public class ExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (ApiException ex)
            {
                await HandleApiExceptionAsync(httpContext, ex);
            }
        }

        private static async Task HandleApiExceptionAsync(HttpContext context, ApiException exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)exception.StatusCode;

            var errorMessage = exception.Value?.ToString() ?? exception.Message;
            await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = errorMessage }));
        }
    }
}
