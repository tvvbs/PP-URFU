using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    [ProducesResponseType(200, Type = typeof(Vacancy))]
    public IResult GetVacancy(Guid id)
    {
        var vacancy = _dbContext.Vacancies.Include((x) => x.Company).IncludeAllRecursively().FirstOrDefault(x => x.Id == id);
        if (vacancy is null)
            return Results.Problem("Вакансия с таким идентификатором не найдена");
        
        return Results.Ok(vacancy);
    }
    
    [Authorize(Roles = nameof(Admin))]
    [HttpPost("create")]
    public IResult CreateVacancy([FromBody] VacancyViewModel viewModel)
    {
        if (viewModel.Id is not null)
            return Results.Problem("Идентификатор вакансии не указан");
        
        if (viewModel.Name is null || viewModel.PositionName is null || viewModel.IncomeRub is null || viewModel.Description is null)
        {
            return Results.Problem("Вы должны заполнить все данные о вакансии");
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
        _notificationService.SendNotification(Guid.Empty, 
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
        var vacancyResponses = _dbContext.VacancyResponses.IncludeAllRecursively().Where(x => x.Vacancy.Id == id);
        foreach (var vacancyResponse in vacancyResponses)
        {
            _dbContext.VacancyResponses.Remove(vacancyResponse);
        }
        _dbContext.Vacancies.Remove(vacancy);
        _dbContext.SaveChanges();
        return Results.Ok();
    }
    
    [Authorize(Roles = nameof(Admin))]
    [HttpPost("edit")]
    public IResult EditVacancy([FromBody] VacancyViewModel viewModel)
    {
        if (viewModel.Id is null)
            return Results.Problem("Не указан идентификатор вакансии");
        
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
        return Results.Ok(_dbContext.Vacancies.Include(x=>x.Company).IncludeAllRecursively().ToList());
    }
    
    
    
    public record AddRwReviewViewModel(Guid? VacancyId, Guid? StudentId, string? Comment, int? Rating);
    [Authorize]
    [HttpPost("add-review")]
    public IResult AddReview([FromBody] AddRwReviewViewModel viewModel)
    {
        if (viewModel.VacancyId is null || viewModel.Rating is null || viewModel.Comment is null || viewModel.StudentId is null) 
            return Results.Problem("Отзыв должен быть полностью заполнен");
        
        // check that Rating value is in range of enum Rating
        if (!Enum.IsDefined(typeof(Rating), viewModel.Rating.Value))
            return Results.Problem("Неверное значение рейтинга");
        
        // check that student had internship in this company
        var internship = _dbContext.Internships.IncludeAllRecursively()
            .FirstOrDefault(x => x.Student.Id == viewModel.StudentId && x.Vacancy.Id == viewModel.VacancyId);
        if (internship is null)
            return Results.Problem("Студент не проходил стажировку в этой компании");
        
        
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
    
    [Authorize]
    [HttpGet("reviews/{id:guid}")]
    [ProducesResponseType(200, Type = typeof(List<ReviewOfVacancy>))]
    public IResult GetReview(Guid id)
    {
        if (!_dbContext.Vacancies.Where(x => x.Id == id).Any())
        {
            return Results.Problem(detail: "Не удалось найти вакансию", statusCode: 400);
        }
        

        return Results.Ok(_dbContext.ReviewsOfVacancies.Include(x=>x.Vacancy).Include(x=>x.Student)
                              .Where(x => x.Vacancy.Id == id).ToList());
    }
    
}