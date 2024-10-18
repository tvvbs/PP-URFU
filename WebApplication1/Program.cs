using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebApplication1.Controllers;
using WebApplication1.Database;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<PracticeDbContext>((o) => o.UseNpgsql("Host=85.115.189.150;Database=Website;Port=5432;Username=postgres;Password=12345678;IncludeErrorDetail=true"));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // укзывает, будет ли валидироваться издатель при валидации токена
            ValidateIssuer = true,
            // строка, представляющая издателя
            ValidIssuer = AuthOptions.ISSUER,
 
            // будет ли валидироваться потребитель токена
            ValidateAudience = true,
            // установка потребителя токена
            ValidAudience = AuthOptions.AUDIENCE,
            // будет ли валидироваться время существования
            ValidateLifetime = true,
 
            // установка ключа безопасности
            IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
            // валидация ключа безопасности
            ValidateIssuerSigningKey = true,
        };
    });
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy => { policy.AllowAnyHeader().AllowAnyMethod().AllowCredentials().SetIsOriginAllowed(origin => true); });
});
var app = builder.Build();

var scope = app.Services.CreateScope();
var bd = scope.ServiceProvider.GetService<PracticeDbContext>();
bd.Database.EnsureCreated();


// bd.VacancyResponsesStatuses.Add(new VacancyResponseStatus() { Id = Guid.Parse("624654C4-AAF5-489E-93F5-F043F9FE8C93"), Name = "На рассмотрении"});
// bd.VacancyResponsesStatuses.Add(new VacancyResponseStatus() { Id = Guid.Parse("B1C14A35-7581-4056-A49A-B6245D364B44"), Name = "Не подходит"});
// bd.VacancyResponsesStatuses.Add(new VacancyResponseStatus() { Id = Guid.Parse("F2B757AE-FA32-4FDC-A32D-9171DD14253C"), Name = "Приглашен на собеседование"});
bd.SaveChanges();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();