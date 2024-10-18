using System.ComponentModel;

namespace WebApplication1.Database;

public class VacancyResponse
{
    public Guid? Id { get; set; }
    public Vacancy? Vacancy { get; set; }
    public string? Text { get; set; }
    public File? Resume { get; set; }
    public Student? Student { get; set; }
    public VacancyResponseStatus? Status { get; set; }
}

public enum VacancyResponseStatus
{
    
    [Description("Ожидает решения")]
    Pending,
    [Description("Отклонено")]
    Declined,
    [Description("Приглашен на собеседование")]
    InvitedToInterview,
}