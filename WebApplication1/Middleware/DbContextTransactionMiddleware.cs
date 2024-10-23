using WebApplication1.Database;

namespace WebApplication1.Middleware;


public class DbContextTransactionMiddleware
{
    private readonly RequestDelegate _next;

    public DbContextTransactionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public static object _lock = new();
    public Task InvokeAsync(HttpContext context, PracticeDbContext dbContext, ILogger<DbContextTransactionMiddleware> logger)
    {
        lock (_lock)
        {
            // create middleware for transactions
            using var transaction = dbContext.Database.BeginTransaction();
            try
            {
                _next(context).Wait();
                transaction.Commit();
            }
            catch (Exception ex)
            {
                logger.LogError($"Exception: {ex}");
                transaction.Rollback();

                throw;
            }
        }

        return Task.CompletedTask;
    }
}