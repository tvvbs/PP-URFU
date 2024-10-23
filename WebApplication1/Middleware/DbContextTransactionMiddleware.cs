using WebApplication1.Database;

namespace WebApplication1.Middleware;


public class DbContextTransactionMiddleware
{
    private readonly RequestDelegate _next;

    public DbContextTransactionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, PracticeDbContext dbContext)
    {

        // create middleware for transactions
        await using var transaction = await dbContext.Database.BeginTransactionAsync();
        try
        {
            await _next(context);
            await transaction.CommitAsync();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"Exception: {ex.Message}");
            Console.ResetColor();
        }
    }
}