namespace WebApplication1.Database;

public class VacancyResponseStatus
{
    public class KnownId
    {
        // , Name = "На рассмотрении"})
        public Guid OnReview = Guid.Parse("624654C4-AAF5-489E-93F5-F043F9FE8C93");
        // , Name = "Не подходит"})
        public Guid Declined = Guid.Parse("B1C14A35-7581-4056-A49A-B6245D364B44");
        // , Name = "Приглашен на собеседование"})
        public Guid InvitedToInterview = Guid.Parse("F2B757AE-FA32-4FDC-A32D-9171DD14253C");
    } 
    public Guid? Id { get; set; }
    public string? Name { get; set; }
}

