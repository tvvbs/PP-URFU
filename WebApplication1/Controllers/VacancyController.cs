using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Database;

namespace WebApplication1.Controllers;

[ApiController]
[Route("[controller]")]
public class VacancyController : MyController
{
    private readonly PracticeDbContext _dbContext;
    private NotificationService _notificationService;
    private LinkGenerator _linkGenerator;

    public VacancyController(PracticeDbContext dbContext, NotificationService notificationService, LinkGenerator linkGenerator)
    {
        _dbContext = dbContext;
        _notificationService = notificationService;
        _linkGenerator = linkGenerator;
    }

    
    public class VacancyViewModel
    {
        public Guid? Id { get; set; }
        public string? Name { get; set; }
        public string? PositionName { get; set; }
        public int? IncomeRub { get; set; }
        public string? Description { get; set; }
        public Guid? CompanyId { get; set; }
    }
    
    [Authorize]
    [HttpGet("get/{id:guid}")]
    public IResult GetVacancy(Guid id)
    {
        var vacancy = _dbContext.Vacancies.FirstOrDefault(x => x.Id == id);
        if (vacancy is null)
            return Results.BadRequest("Vacancy not found");
        
        return Results.Ok(vacancy);
    }
    
    [Authorize(Roles = nameof(Admin))]
    [HttpPost("create")]
    public IResult CreateVacancy([FromBody] VacancyViewModel viewModel)
    {
        if (viewModel.Id is not null)
            return Results.BadRequest("Id should be null");
        
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
        _notificationService.SendNotification(vacancy.Id.Value,
                                              NotificationType.NewVacancy, 
                                              JsonSerializer.Serialize(new { companyId = company.Id, vacancyId = vacancy.Id,}));
        _dbContext.SaveChanges();
        return Results.Ok();
    }
    
    [Authorize(Roles = nameof(Admin))]
    [HttpDelete("delete/{id:guid}")]
    public IResult DeleteVacancy(Guid id)
    {
        var vacancy = _dbContext.Vacancies.First(x => x.Id == id);
        _dbContext.Vacancies.Remove(vacancy);
        _dbContext.SaveChanges();
        return Results.Ok();
    }
    
    [Authorize(Roles = nameof(Admin))]
    [HttpPost("edit")]
    public IResult EditVacancy([FromBody] VacancyViewModel viewModel)
    {
        if (viewModel.Id is null)
            return Results.BadRequest("Id should not be null");
        
        var vacancy = _dbContext.Vacancies.First(x => x.Id == viewModel.Id);
        vacancy.Name = viewModel.Name;
        vacancy.PositionName = viewModel.PositionName;
        vacancy.IncomeRub = viewModel.IncomeRub.Value;
        vacancy.Description = viewModel.Description;
        _dbContext.SaveChanges();
        return Results.Ok();
    }
}