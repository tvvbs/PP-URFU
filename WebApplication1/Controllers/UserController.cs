using System.Diagnostics.Tracing;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebApplication1.Database;

namespace WebApplication1.Controllers;

public static class AuthOptions
{
    public const string ISSUER = "MyAuthServer"; // издатель токена
    public const string AUDIENCE = "MyAuthClient"; // потребитель токена
    const string KEY = "mysupersecret_secretkey!mysupersecret_key";   // ключ для шифрации
    public const int LIFETIME = 1000; // время жизни токена в минутах
    public static SymmetricSecurityKey GetSymmetricSecurityKey()
    {
        return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
    }
    public static Guid? GetCurrentUserId(this ClaimsPrincipal user)
    {
        var id = user.Claims.FirstOrDefault(x => x.Type == "id")?.Value;
        if (id is null)
            return null;
        
        return Guid.Parse(id);
    }
}

[ApiController]
[Route("[controller]")]
public class UserController : MyController
{
    public UserController(PracticeDbContext dbContext) : base(dbContext)
    {
    }
    
    public class RegisterStudentViewModel
    {
        public string? Login { get; set; }
        public string? Password { get; set; }
        public string? PasswordRepeat { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? Patronymic { get; set; }
    }
    [HttpPost("register-student")]
    public IResult RegisterStudent([FromBody] RegisterStudentViewModel viewModel)
    {
        if (viewModel.Password != viewModel.PasswordRepeat)
        {
            return Results.Problem(detail: "Пароли не совпадают", statusCode: 500);
        }
        var sameLogin = _dbContext.Students.Where((x) => x.Login == viewModel.Login).ToList();
        if (sameLogin.Any())
            return Results.Problem(detail: "Логин занят", statusCode: 500);

        var newStudent = new Student()
        {
            Id = Guid.NewGuid(),
            Login = viewModel.Login,
            Name = viewModel.Name,
            Surname = viewModel.Surname,
            Patronymic = viewModel.Patronymic,
            Password = viewModel.Password
        };
        _dbContext.Students.Add(newStudent);
        _dbContext.SaveChanges();
        return Results.Ok(newStudent.Id);
    }

    public class RegisterCompanyViewModel
    {
        public string? Login { get; set; }
        public string? Password { get; set; }
        public string? PasswordRepeat { get; set; }
        public string? Name { get; set; }
    }
    [HttpPost("register-company")]
    public IResult RegisterCompany([FromBody] RegisterCompanyViewModel viewModel)
    {
        if (viewModel.Password != viewModel.PasswordRepeat)
            return Results.Problem(detail: "Пароли не совпадают", statusCode: 500);
        
        var sameLogin = _dbContext.Companies.Where((x) => x.Login == viewModel.Login).ToList();
        if (sameLogin.Any())
            return Results.Problem(detail: "Логин занят", statusCode: 500);
        
        var sameName = _dbContext.Companies.Where((x) => x.Name == viewModel.Login).ToList();
        if (sameName.Any())
            return Results.Problem(detail: "Имя занято", statusCode: 500);

        var newCompany = new Company
        {
            Id = Guid.NewGuid(),
            Login = viewModel.Login,
            Name = viewModel.Name,
            Password = viewModel.Password
        };
        _dbContext.Companies.Add(newCompany);
        _dbContext.SaveChanges();
        return Results.Ok(newCompany.Id);
    }

    public class LoginViewModel
    {
        public string? Login { get; set; }
        public string? Password { get; set; }
    }
    [HttpPost("login-student")]
    public async Task<IResult> LoginStudent([FromBody] LoginViewModel viewModel)
    {
        if (User.Identity?.IsAuthenticated is true)
        {
            return Results.Problem(detail:"Вы уже авторизованы", statusCode: 500);
        }
        var user = _dbContext.Students.FirstOrDefault(x => x.Login == viewModel.Login && x.Password == viewModel.Password);
        if (user is null)
            return Results.Problem(detail: "Логин или пароль не совпадают");


        var token = await GenerateToken(viewModel.Login, viewModel.Password, nameof(Student)); 
        if (token is not null)
        {
            return Results.Ok(token);   
        }
            
        return Results.Problem("Не удалось создать токен", statusCode: StatusCodes.Status500InternalServerError);
    }
    
    [HttpPost("login-company")]
    public async Task<IResult> LoginCompany([FromBody] LoginViewModel viewModel)
    {
        if (User.Identity?.IsAuthenticated is true)
        {
            return Results.Problem(detail:"Вы уже авторизованы", statusCode: 500);
        }
        var user = _dbContext.Companies.FirstOrDefault(x => x.Login == viewModel.Login && x.Password == viewModel.Password);
        if (user is null)
            return Results.Problem(detail: "Логин или пароль не совпадают");


        var token = await GenerateToken(viewModel.Login, viewModel.Password, nameof(Company)); 
        if (token is not null)
            return Results.Ok(token);
        
            
        return Results.Problem("Не удалось создать токен", statusCode: StatusCodes.Status500InternalServerError);
    }
    
    private async Task<ClaimsIdentity> GetIdentity(string login, string password, string role)
    {
        Guid? id = role switch
        {
            nameof(Student) => _dbContext.Students.FirstOrDefault(x => x.Login == login && x.Password == password)?.Id,
            nameof(Company) => _dbContext.Companies.FirstOrDefault(x => x.Login == login && x.Password == password)?.Id,
            nameof(Admin) => _dbContext.Admins.FirstOrDefault(x => x.Login == login && x.Password == password)?.Id,
            _ => throw new Exception("Invalid role")
        };
        if (id is null)
            throw new Exception("User not found");
        
        var loginClaim = new Claim(ClaimsIdentity.DefaultNameClaimType, login);
        var roleClaim = new Claim(ClaimTypes.Role, role);
        var idClaim = new Claim("id", id.ToString());
        
        var claims = new List<Claim>
        {
            loginClaim,
            roleClaim,
            idClaim
        };
        var claimsIdentity = new ClaimsIdentity(claims, "Token", 
                                                ClaimsIdentity.DefaultNameClaimType,
                                                ClaimsIdentity.DefaultRoleClaimType);
        return claimsIdentity;
    }
    
    private async Task<string?> GenerateToken(string login, string password, string role)
    {
        
        var identity = await GetIdentity(login, password, role);
        var jwt = new JwtSecurityToken(
            issuer: AuthOptions.ISSUER,
            audience: AuthOptions.AUDIENCE,
            notBefore: DateTime.UtcNow,
            claims: identity.Claims,
            expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(AuthOptions.LIFETIME)),
            signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
        var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
        
        return encodedJwt;
    }
    
    /// <summary>
    /// Role and Id for current user
    /// </summary>
    /// <remarks>
    /// return type: {"role": "Student/Company/Admin", "id": "uuid" }
    /// </remarks>
    /// <returns></returns>
    [Authorize]
    [HttpGet("current-role-and-id")]
    public IResult GetCurrentRole()
    {
        var role = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role)?.Value;
        if (role is null)
            return Results.Problem("Role not found", statusCode: 500);
        var id = User.Claims.FirstOrDefault(x => x.Type == "id")?.Value;
        if (id is null)
            return Results.Problem("Id not found", statusCode: 500);
        
        return Results.Ok(new {role, id});
    }
    
    // create login method for admins
    [HttpPost("login-admin")]
    public async Task<IResult> LoginAdmin([FromBody] LoginViewModel viewModel)
    {
        if (User.Identity?.IsAuthenticated is true)
        {
            return Results.Problem(detail: "Вы уже авторизованы", statusCode: 500);
        }

        var user = _dbContext.Admins.FirstOrDefault(x => x.Login == viewModel.Login && x.Password == viewModel.Password);
        if (user is null)
            return Results.Problem(detail: "Логин или пароль не совпадают");
        
        var token = await GenerateToken(viewModel.Login, viewModel.Password, nameof(Admin));
        if (token is not null)
            return Results.Ok(token);
        
        return Results.Problem("Не удалось создать токен", statusCode: StatusCodes.Status500InternalServerError);
    }
}