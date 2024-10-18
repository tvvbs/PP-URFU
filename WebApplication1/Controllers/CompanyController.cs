using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Database;

namespace WebApplication1.Controllers;
[ApiController]
[Route("[controller]")]
public class CompanyController : ControllerBase
{
    [Authorize]
    [HttpGet("get-all")]
    public IResult GetAll()
    {
        return Results.Ok(new List<Company>
        {
            new Company()
            {
                Id = Guid.Parse("DBCCCA86-69AD-4CFD-AB93-2D81A8A6E585"),
                Login = "company1",
                Name = "Company1",
                Password = "1"
            },
            new Company()
            {
                Id = Guid.Parse("DBBBBA86-69AD-4CFD-AB93-2D81A8A6E585"),
                Login = "company2",
                Name = "Company2",
                Password = "1"
            }
        });
    }
}