using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Database;

namespace WebApplication1.Controllers;

[ApiController]
[Route("[controller]")]
public class VacancyController : MyController
{
    private readonly PracticeDbContext _dbContext;

    public VacancyController(PracticeDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    
    public class CreateVacancyViewModel
    {
        public string? Name { get; set; }
        public string? PositionName { get; set; }
        public int? IncomeRub { get; set; }
        public string? Description { get; set; }
    }
    [Authorize(Roles = nameof(Company))]
    [HttpPost("create")]
    public IResult CreateVacancy(CreateVacancyViewModel viewModel)
    {
        if (viewModel.Name is null || viewModel.PositionName is null || viewModel.IncomeRub is null || viewModel.Description is null)
        {
            return Results.BadRequest();
        }
        var company = _dbContext.Companies.First(x=> x.Id == this.User.GetCurrentUserId());
        var vacancy = new Vacancy()
        {
            Id = Guid.NewGuid(),
            Name = viewModel.Name,
            PositionName = viewModel.PositionName,
            IncomeRub = viewModel.IncomeRub.Value,
            Description = viewModel.Description,
            Company = company
        };
        _dbContext.Vacancies.Add(vacancy);
        _dbContext.SaveChanges();
        return Results.Ok();
    }
    
}