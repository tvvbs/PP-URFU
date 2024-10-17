using System.Runtime.InteropServices.JavaScript;

namespace WebApplication1.Database;

public class Interview
{
    public Guid Id { get; set; }
    public Vacancy Vacancy { get; set; }
    public Student Student { get; set; }
    public VacancyResponse VacancyResponse { get; set; }
    public DateTime DateTime { get; set; } 
}