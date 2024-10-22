namespace WebApplication1.Database;

public class Vacancy
{
    public Guid? Id { get; set; }
    public string? Name { get; set; }
    public string? PositionName { get; set; }
    public int? IncomeRub { get; set; }
    public string? Description { get; set; }
    public virtual Company? Company { get; set; }
}