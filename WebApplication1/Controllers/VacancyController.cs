using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Database;

namespace WebApplication1.Controllers;

[ApiController]
[Route("[controller]")]
public class VacancyController : ControllerBase
{
    private readonly PracticeDbContext _dbContext;

    public VacancyController(PracticeDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [Authorize(Roles = nameof(Company))]
    [HttpPost("create")]
    public IResult CreateVacancy(string? name, string? positionName, int? incomeRub, string? description)
    {
        if (name is null || positionName is null || incomeRub is null || description is null)
        {
            return Results.BadRequest();
        }
        var company = _dbContext.Companies.First(x=> x.Id == this.User.GetCurrentUserId());
        var vacancy = new Vacancy()
        {
            Id = Guid.NewGuid(),
            Name = name,
            PositionName = positionName,
            IncomeRub = incomeRub.Value,
            Description = description,
            Company = company
        };
        _dbContext.Vacancies.Add(vacancy);
        _dbContext.SaveChanges();
        return Results.Ok();
    }
    
}