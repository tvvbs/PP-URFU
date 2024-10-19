using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using WebApplication1.Database;

namespace WebApplication1.Controllers;

public class MyController : Controller
{
    protected readonly PracticeDbContext _dbContext;

    public MyController(PracticeDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public override void OnActionExecuting(ActionExecutingContext filterContext)
    {
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine(filterContext.HttpContext.Request.Path);
        Console.WriteLine("Parameters:\n" + System.Text.Json.JsonSerializer.Serialize(filterContext.ActionArguments, new JsonSerializerOptions(){WriteIndented = true}));
        Console.ResetColor();
        

        base.OnActionExecuting(filterContext);
    }
}