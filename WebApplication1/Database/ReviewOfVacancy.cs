namespace WebApplication1.Database;

public class ReviewOfVacancy
{
    public Guid? Id { get; set; }
    public virtual Student? Student { get; set; }
    public virtual Vacancy? Vacancy { get; set; }
    public Rating? Rating { get; set; }
    public string? Comment { get; set; }
}