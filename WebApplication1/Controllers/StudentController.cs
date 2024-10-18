using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Database;

namespace WebApplication1.Controllers;

public class StudentController : MyController
{
    public PracticeDbContext _dbContext;

    public StudentController(PracticeDbContext dbContext)
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
    public IResult EditStudent(StudentViewModel viewModel)
    {
        // validate viewModel id and edit student and save changes
        if (viewModel.Id is null)
            return Results.BadRequest("Id should not be null");
        
        // check if same login exists
        var sameLogin = _dbContext.Students.Where((x) => x.Login == viewModel.Login).ToList();
        if (sameLogin.Any())
            return Results.Problem(detail: "Логин занят", statusCode: 500);
        
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
    [HttpPost("delete")]
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
    public IResult GetStudent(Guid id)
    {
        var student = _dbContext.Students.FirstOrDefault(x => x.Id == id);
        if (student is null)
            return Results.BadRequest("Student not found");
        
        return Results.Ok(student);
    }
}