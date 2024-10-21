using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Database;

namespace WebApplication1.Controllers;

[ApiController]
[Route("[controller]")]
public class VacancyController : MyController
{
    
    private NotificationService _notificationService;
    private LinkGenerator _linkGenerator;

    public VacancyController(PracticeDbContext dbContext, NotificationService notificationService, LinkGenerator linkGenerator) : base(dbContext)
    {
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

    [Authorize]
    [HttpGet("all")]
    [ProducesResponseType(200, Type = typeof(List<Vacancy>))]
    public IResult GetAll()
    {
        return Results.Ok(_dbContext.Vacancies.IncludeAllRecursively().ToList());
    }
    
    
    
    public record AddRwReviewViewModel(Guid? VacancyId, Guid? StudentId, string? Comment, int? Rating);
    [Authorize]
    [HttpPost("add-review")]
    public IResult AddReview([FromBody] AddRwReviewViewModel viewModel)
    {
        if (viewModel.VacancyId is null || viewModel.Rating is null || viewModel.Comment is null || viewModel.StudentId is null) 
            return Results.BadRequest("VacancyId and Rating should not be null");
        
        // check that Rating value is in range of enum Rating
        if (!Enum.IsDefined(typeof(Rating), viewModel.Rating.Value))
            return Results.BadRequest("Неверное значение рейтинга");
        
        // check that student had internship in this company
        var internship = _dbContext.Internships.IncludeAllRecursively()
            .FirstOrDefault(x => x.Student.Id == viewModel.StudentId && x.Vacancy.Id == viewModel.VacancyId);
        if (internship is null)
            return Results.BadRequest("Студент не проходил стажировку в этой компании");
        
        
        // add review to database
        var review = new ReviewOfVacancy()
        {
            Id = Guid.NewGuid(),
            Student = _dbContext.Students.First(x => x.Id == viewModel.StudentId),
            Vacancy = _dbContext.Vacancies.First(x => x.Id == viewModel.VacancyId),
            Comment = viewModel.Comment,
            Rating = (Rating) viewModel.Rating.Value
        };
        _dbContext.ReviewsOfVacancies.Add(review);
        
        _dbContext.SaveChanges();
        return Results.Ok();
    }
    
}