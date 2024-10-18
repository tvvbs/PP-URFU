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

    
    public class VacancyViewModel
    {
        public string? Name { get; set; }
        public string? PositionName { get; set; }
        public int? IncomeRub { get; set; }
        public string? Description { get; set; }
        public Guid? CompanyId { get; set; }
    }
    [Authorize(Roles = nameof(Admin))]
    [HttpPost("create")]
    public IResult CreateVacancy(VacancyViewModel viewModel)
    {
        if (viewModel.Name is null || viewModel.PositionName is null || viewModel.IncomeRub is null || viewModel.Description is null)
        {
            return Results.BadRequest();
        }
        var company = _dbContext.Companies.First(x=> x.Id == viewModel.CompanyId);
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
    
    [Authorize(Roles = nameof(Admin))]
    [HttpPost("delete")]
    public IResult DeleteVacancy(Guid id)
    {
        var vacancy = _dbContext.Vacancies.First(x => x.Id == id);
        _dbContext.Vacancies.Remove(vacancy);
        _dbContext.SaveChanges();
        return Results.Ok();
    }
    
    [Authorize(Roles = nameof(Admin))]
    [HttpPost("edit")]
    public IResult EditVacancy(Guid id, VacancyViewModel viewModel)
    {
        var vacancy = _dbContext.Vacancies.First(x => x.Id == id);
        vacancy.Name = viewModel.Name;
        vacancy.PositionName = viewModel.PositionName;
        vacancy.IncomeRub = viewModel.IncomeRub.Value;
        vacancy.Description = viewModel.Description;
        _dbContext.SaveChanges();
        return Results.Ok();
    }
    
}