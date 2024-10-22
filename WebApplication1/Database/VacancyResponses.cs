using System.ComponentModel;

namespace WebApplication1.Database;

public class VacancyResponse
{
    public Guid? Id { get; set; }
    public virtual Vacancy? Vacancy { get; set; }
    public string? Text { get; set; }
    public virtual File? Resume { get; set; }
    public virtual Student? Student { get; set; }
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