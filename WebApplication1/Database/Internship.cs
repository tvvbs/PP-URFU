using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Database;

public enum InternshipStatus
{
    PassingNow,
    Declined,
    Passed
}
public class Internship
{
    [Key]
    [ForeignKey(nameof(Student))]
    public Guid? Id { get; set; }
    public virtual Student? Student { get; set; }
    
    public Guid? VacancyId { get; set; }
    public virtual Vacancy? Vacancy { get; set; }
    
    public virtual InternshipStatus? Status { get; set; }
}