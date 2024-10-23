using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Database;

namespace WebApplication1.Controllers;
[ApiController]
[Route("[controller]")]
public class VacancyResponsesController : MyController
{
      public VacancyResponsesController(PracticeDbContext dbContext) : base(dbContext)
      {
      }
      
      // get all
      [HttpGet("get-all")]
      [Authorize]
      [ProducesResponseType(200, Type = typeof(List<VacancyResponse>))]
      public IResult GetAll()
      {
            return Results.Ok(_dbContext.VacancyResponses.Include(x => x.Vacancy).Include(x => x.Student).Include(x => x.Resume).IncludeAllRecursively().ToList());
      }
      
      // all for student 
      [HttpGet("get-for-student/{studentId:guid}")]
      [Authorize]
      [ProducesResponseType(200, Type = typeof(List<VacancyResponse>))]
      public IResult GetAll(Guid? studentId)
      {
            if (studentId is null)
            {
                  return Results.Problem("нужно указать id студента");
            }
            var student = _dbContext.Students.FirstOrDefault(x => x.Id == studentId);
            if (student is null)
            {
                  return Results.Problem("Студент не найден");
            }
            return Results.Ok(_dbContext.VacancyResponses.Include(x => x.Vacancy).Include(x => x.Student).Include(x => x.Resume).ToList().Where(x => x.Student.Id == studentId).ToList());
      }
}