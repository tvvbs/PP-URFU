namespace WebApplication1.Database;

public class Notification
{
    public Guid? Id { get; set; }
    public Guid? Receiver { get; set; }
    public string? Text { get; set; }
}