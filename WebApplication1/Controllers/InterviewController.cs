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
            return Results.BadRequest("Student not found");
        
        var interviews = _dbContext.Interviews.IncludeAllRecursively().Where(x => x.Student.Id == studentId).ToList();
        return Results.Ok(interviews);
    }
    
    // create method for getting all interviews for company
    [Authorize]
    [HttpGet("get-all-for-company/{companyId:guid}")]
    public IResult GetAllForCompany(Guid companyId)
    {
        // check company exists
        var company = _dbContext.Companies.FirstOrDefault(x => x.Id == companyId);
        if (company is null)
            return Results.BadRequest("Company not found");
        
        var interviews = _dbContext.Interviews.IncludeAllRecursively().Where(x => x.Vacancy.Company.Id == companyId).ToList();
        return Results.Ok(interviews);
    }
    
    // create method for getting interview by id
    [Authorize]
    [HttpGet("get/{id:guid}")]
    public IResult GetInterview(Guid id)
    {
        var interview = _dbContext.Interviews.IncludeAllRecursively().FirstOrDefault(x => x.Id == id);
        if (interview is null)
            return Results.BadRequest("Interview not found");
        
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
            return Results.BadRequest("Интервью не найдено");
        
        // check that current time is after interview time
        if (viewModel.Result != InterviewResult.Canceled)
        {
            // if current user is not admin
            if (!User.IsInRole(nameof(Admin)))
            {
                if (currentInterview.DateTime.ToUniversalTime() > DateTime.UtcNow)
                    return Results.BadRequest("Интервью еще не началось");
            }
        }
        
        currentInterview.Result = viewModel.Result;
        if (currentInterview.Result == InterviewResult.Passed)
        {
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