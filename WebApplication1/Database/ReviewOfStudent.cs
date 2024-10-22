namespace WebApplication1.Database;

public enum Rating
{
    One,
    Two,
    Three,
    Four,
    Five
}
public class ReviewOfStudent
{
    public Guid? Id { get; set; }
    public virtual Student? Student { get; set; }
    public virtual Internship? Internship { get; set; }
    public Rating? Rating { get; set; }
    public string? Comment { get; set; }
}