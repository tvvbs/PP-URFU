using System.Data.Common;
using System.Reflection;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.SwaggerGen;
using WebApplication1;
using WebApplication1.Controllers;
using WebApplication1.Database;
using WebApplication1.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(
    opts =>
    {
        var enumConverter = new JsonStringEnumConverter();
        opts.JsonSerializerOptions.Converters.Add(enumConverter);
    });
builder.Services.AddDbContext<PracticeDbContext>((o) => o.UseNpgsql("Host=85.115.189.150;Database=Website;Port=5432;Username=postgres;Password=12345678;IncludeErrorDetail=true")
    .ConfigureWarnings(x =>
    {
        x.Ignore(CoreEventId.InvalidIncludePathError);
        x.Ignore(CoreEventId.NavigationBaseIncludeIgnored);
    }));
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
        policy => { 
            policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader(); 
        });
});


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});

builder.Services.AddScoped<NotificationService>();
var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();



var scope = app.Services.CreateScope();
var bd = scope.ServiceProvider.GetService<PracticeDbContext>();
bd.Database.Migrate();

if (!bd.Admins.Where(x => x.Login == "admin@admin").Any())
{
    var admin = new Admin()
    {
        Id = Guid.NewGuid(),
        Login = "admin@admin",
        Password = "admin"
    };
    bd.Admins.Add(admin);
}

bd.SaveChanges();

app.UseMiddleware<ExceptionHandlingMiddleware>();
// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStaticFiles();

app.UseRouting();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();


app.UseMiddleware<DbContextTransactionMiddleware>();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();