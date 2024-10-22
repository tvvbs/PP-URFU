using System.ComponentModel;
using System.Runtime.InteropServices.JavaScript;

namespace WebApplication1.Database;

public class Interview
{
    public Guid Id { get; set; }
    public virtual Vacancy Vacancy { get; set; }
    public virtual Student Student { get; set; }
    public virtual VacancyResponse VacancyResponse { get; set; }
    public DateTime DateTime { get; set; } 
    
    public InterviewResult? Result { get; set; }
}

public enum InterviewResult
{
    [Description("Прошел успешно")]
    Passed,
    [Description("Не прошел")]
    Failed,
    [Description("Отменено")]
    Canceled,
    [Description("Не явился")]
    DidNotCome,
}