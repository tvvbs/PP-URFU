namespace WebApplication1.Database;

public class ReviewOfVacancy
{
    public Guid? Id { get; set; }
    public Student? Student { get; set; }
    public Vacancy? Vacancy { get; set; }
    public Rating? Rating { get; set; }
    public string? Comment { get; set; }
}