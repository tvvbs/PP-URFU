using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Database;

namespace WebApplication1.Controllers;

[ApiController]
[Route("[controller]")]
public class StudentController : MyController
{
    public PracticeDbContext _dbContext;

    public StudentController(PracticeDbContext dbContext): base(dbContext)
    {
        _dbContext = dbContext;
    }

    public class StudentViewModel
    {
        public Guid? Id { get; set; }
        public string? Login { get; set; }
        public string? Password { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? Patronymic { get; set; }
    }
    [Authorize(Roles = $"{nameof(Student)},{nameof(Admin)}")]
        [HttpPost("edit")]
        public IResult EditStudent([FromBody] StudentViewModel viewModel)
        {
            // validate viewModel id and edit student and save changes
            if (viewModel.Id is null)
                return Results.BadRequest("Id should not be null");

            var currentUser = _dbContext.Students.FirstOrDefault(x => x.Id == viewModel.Id);
            if (currentUser is null)
                return Results.BadRequest("Student not found");

            if (viewModel.Login != currentUser.Login)
            {
                // check if same login exists
                var sameLogin = _dbContext.Students.Where((x) => x.Login == viewModel.Login).ToList();
                if (sameLogin.Any())
                    return Results.Problem(detail: "Логин занят", statusCode: 500);
            }

            var student = _dbContext.Students.First(x => x.Id == viewModel.Id);
            student.Login = viewModel.Login;
            student.Password = viewModel.Password;

            student.Name = viewModel.Name;
            student.Surname = viewModel.Surname;
            student.Patronymic = viewModel.Patronymic;

            _dbContext.SaveChanges();
            return Results.Ok();
        }
    
    // delete student 
    [Authorize(Roles = nameof(Admin))]
    [HttpDelete("delete/{id:guid}")]
    public IResult DeleteStudent(Guid id)
    {
        var student = _dbContext.Students.FirstOrDefault(x => x.Id == id);
        if (student is null)
            return Results.BadRequest("Student not found");
        
        _dbContext.Students.Remove(student);
        _dbContext.SaveChanges();
        return Results.Ok();
    }
    
    [Authorize]
    [HttpGet("get/{id:guid}")]
    [ProducesResponseType(200, Type = typeof(Student))]
    public IResult GetStudent(Guid id)
    {
        var student = _dbContext.Students.FirstOrDefault(x => x.Id == id);
        if (student is null)
            return Results.BadRequest("Student not found");
        
        return Results.Ok(student);
    }
    
    [Authorize(Roles = nameof(Admin))]
    [HttpGet("get-all")]
    [ProducesResponseType(200, Type = typeof(List<Student>))]
    public IResult GetAll()
    {
        return Results.Ok(_dbContext.Students.ToList());
    }
    
    public record ReviewViewModel(Guid? StudentId, Guid? CompanyId, string? Comment, int? Rating);
    [Authorize]
    [HttpPost("add-review")]
    public IResult AddReview([FromBody] ReviewViewModel viewModel)
    {
        if (viewModel.StudentId is null || viewModel.Rating is null || viewModel.Comment is null || viewModel.CompanyId is null) 
            return Results.BadRequest("StudentId and Rating should not be null");
        
        // check that Rating value is in range of enum Rating
        if (!Enum.IsDefined(typeof(Rating), viewModel.Rating.Value))
            return Results.BadRequest("Неверное значение рейтинга");
        
        // check that student had internship in this company
        var internship = _dbContext.Internships.IncludeAllRecursively()
            .FirstOrDefault(x => x.Student.Id == viewModel.StudentId && x.Vacancy.Company.Id == viewModel.CompanyId);
        if (internship is null)
            return Results.BadRequest("Студент не проходил стажировку в этой компании");
        
        // add review to database
        var review = new ReviewOfStudent()
        {
            Id = Guid.NewGuid(),
            Student = _dbContext.Students.First(x => x.Id == viewModel.StudentId),
            Internship = internship,
            Rating = (Rating)viewModel.Rating.Value,
            Comment = viewModel.Comment
        };
        _dbContext.ReviewsOfStudents.Add(review);
        _dbContext.SaveChanges();
        return Results.Ok();
    }
    
}