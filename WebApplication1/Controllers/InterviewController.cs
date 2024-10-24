using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Database;

namespace WebApplication1.Controllers;

[ApiController]
[Route("[controller]")]
public class InterviewController : MyController
{
    public InterviewController(PracticeDbContext dbContext) : base(dbContext)
    {
    }
    
    // create method for getting all interviews
    [Authorize]
    [HttpGet("get-all")]
    [ProducesResponseType(200, Type = typeof(List<Interview>))]
    public IResult GetAll()
    {
        return Results.Ok(_dbContext.Interviews.IncludeAllRecursively().ToList());
    }

    // create method for getting all interviews
    [Authorize]
    [HttpGet("get-all-for-student/{studentId:guid}")]
    public IResult GetAllForStudent(Guid studentId)
    {
        // check student exists
        var student = _dbContext.Students.FirstOrDefault(x => x.Id == studentId);
        if (student is null)
            return Results.Problem("Такой студент не найден");
        
        var interviews = _dbContext.Interviews.IncludeAllRecursively().Where(x => x.Student.Id == studentId).ToList();
        return Results.Ok(interviews);
    }
    
    // create method for getting all interviews for company
    [Authorize]
    [HttpGet("get-all-for-company/{companyId:guid}")]
    [ProducesResponseType(200, Type = typeof(List<Interview>))]
    public IResult GetAllForCompany(Guid companyId)
    {
        // check company exists
        var company = _dbContext.Companies.FirstOrDefault(x => x.Id == companyId);
        if (company is null)
            return Results.Problem("Компания не найдена");
        
        var interviews = _dbContext.Interviews.IncludeAllRecursively().Where(x => x.Vacancy.Company.Id == companyId).ToList();
        return Results.Ok(interviews);
    }
    
    // create method for getting interview by id
    [Authorize]
    [HttpGet("get/{id:guid}")]
    [ProducesResponseType(200, Type = typeof(Interview))]
    public IResult GetInterview(Guid id)
    {
        var interview = _dbContext.Interviews.IncludeAllRecursively().FirstOrDefault(x => x.Id == id);
        if (interview is null)
            return Results.Problem("Собеседование не найдено");
        
        return Results.Ok(interview);
    }
    
    // create view model for change result method
    public record ChangeResultViewModel(InterviewResult Result);
    
    // create method for changing interview result
    [Authorize(Roles = $"{nameof(Admin)},{nameof(Company)}")]
    [HttpPost("change-result/{interviewId:guid}")]
    public IResult ChangeResult([FromBody] ChangeResultViewModel viewModel, Guid? interviewId)
    {
        // check if interview exists
        var currentInterview = _dbContext.Interviews.IncludeAllRecursively().FirstOrDefault(x => x.Id == interviewId);
        if (currentInterview is null)
            return Results.Problem("Интервью не найдено");
        
        // check that current time is after interview time
        if (viewModel.Result != InterviewResult.Canceled)
        {
            // if current user is not admin
            if (!User.IsInRole(nameof(Admin)))
            {
                if (currentInterview.DateTime.ToUniversalTime() > DateTime.UtcNow)
                    return Results.Problem("Собеседование еще не началось");
            }
        }

        if (currentInterview.Result == viewModel.Result)
        {
            return Results.Ok();
        }
        currentInterview.Result = viewModel.Result;
        if (currentInterview.Result == InterviewResult.Passed)
        {
            if (_dbContext.Internships.IncludeAllRecursively().Any(x => x.Vacancy.Id == currentInterview.Vacancy.Id
                                                                        && x.Student.Id == currentInterview.Student.Id))
            {
                return Results.Problem("Студент уже прошел данное собеседование");
            }
            _dbContext.Internships.Add(new Internship()
            {
                Vacancy = currentInterview.Vacancy,
                Id = Guid.NewGuid(),
                Student = currentInterview.Student,
                VacancyId = currentInterview.Vacancy.Id,
                Status = InternshipStatus.PassingNow
            });
        }
        
        
        
        _dbContext.SaveChanges();
        return Results.Ok();
    }
    
}