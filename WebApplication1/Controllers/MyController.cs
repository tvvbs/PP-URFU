using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace WebApplication1.Controllers;

public class MyController : Controller
{
    public override void OnActionExecuting(ActionExecutingContext filterContext)
    {
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine(filterContext.HttpContext.Request.Path);
        Console.WriteLine("Parameters:\n" + System.Text.Json.JsonSerializer.Serialize(filterContext.ActionArguments, new JsonSerializerOptions(){WriteIndented = true}));
        Console.ResetColor();
        base.OnActionExecuting(filterContext);
    }
}