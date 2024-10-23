using WebApplication1.Database;

namespace WebApplication1.Middleware;


public class DbContextTransactionMiddleware
{
    private readonly RequestDelegate _next;

    public DbContextTransactionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, PracticeDbContext dbContext, ILogger<DbContextTransactionMiddleware> logger)
    {

        if (context.Request.Path.Value != null && context.Request.Path.Value.Contains("get-") || context.Request.Path.Value.Contains("all"))
        {
            Console.WriteLine("oiu");
            await _next(context);
            return;
        }

        Console.WriteLine("oeuihtn");
        // create middleware for transactions
        await using var transaction = await dbContext.Database.BeginTransactionAsync();
        
        try
        {
            await _next(context);
            await transaction.CommitAsync();
        }
        catch (Exception ex)
        {
            logger.LogError($"Exception: {ex}");
            await transaction.RollbackAsync();
            
            throw;
        }
    }
}