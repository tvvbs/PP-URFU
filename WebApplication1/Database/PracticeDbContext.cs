using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Database;

public class PracticeDbContext(DbContextOptions<PracticeDbContext> options) : DbContext(options)
{
    public DbSet<Company> Companies { get; set; }
    public DbSet<File> Files { get; set; }
    public DbSet<Internship> Internships { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<ReviewOfStudent> ReviewsOfStudents { get; set; }
    public DbSet<ReviewOfVacancy> ReviewsOfVacancies { get; set; }
    public DbSet<VacancyResponse> VacancyResponses { get; set; }
    public DbSet<VacancyResponseStatus> VacancyResponsesStatuses { get; set; }
    public DbSet<Vacancy> Vacancies { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<Interview> Interviews { get; set; }
    public DbSet<Admin> Admins { get; set; }
}