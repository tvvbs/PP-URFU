namespace WebApplication1.Database;

public class Notification
{
    public Guid? Id { get; set; }
    public Guid? Receiver { get; set; }
    public NotificationType? Type { get; set; }
    public string? JsonData { get; set; }
    public bool? IsRead { get; set; }
}

public enum NotificationType
{
    FreeForm,
    NewVacancy,
}