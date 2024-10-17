using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Controllers;

public class UserController : ControllerBase
{
    IResult Register(string? login, 
                     string? password,
                     string? passwordRepeat, 
                     string? name,
                     string? surname)
    {
        throw new Exception();
    }

    IResult Login(string? login, string? password)
    {
        throw new Exception();
    }
}