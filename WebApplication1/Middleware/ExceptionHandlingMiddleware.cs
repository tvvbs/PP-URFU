using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Middleware;

public class ExceptionHandlingMiddleware
{
      private readonly RequestDelegate _next;
      private readonly ILogger<ExceptionHandlingMiddleware> _logger;

      public ExceptionHandlingMiddleware(
            RequestDelegate next,
            ILogger<ExceptionHandlingMiddleware> logger)
      {
            _next = next;
            _logger = logger;
      }

      public async Task InvokeAsync(HttpContext context)
      {
            try
            {
                  await _next(context);
            }
            catch (Exception exception)
            {

                  var problemDetails = new ProblemDetails
                  {
                        Status = StatusCodes.Status500InternalServerError,
                        Title = "Привет 👋 на сервере случилась беда",
                        Detail = "Подробнее: \n" + exception,
                        
                  };

                  if (!context.Response.HasStarted)
                  {
                        context.Response.StatusCode = StatusCodes.Status500InternalServerError;

                        await context.Response.WriteAsJsonAsync(problemDetails);
                  }
            }
      }
}
