using Microsoft.AspNetCore.Mvc;
using WebApplication1.Database;

namespace WebApplication1.Controllers;

public class NotificationService 
{
    private PracticeDbContext _dbContext;

    public NotificationService(PracticeDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public void SendNotification(Guid id, string message)
    {
        var student = _dbContext.Students.FirstOrDefault(x => x.Id == id);
        var company = _dbContext.Companies.FirstOrDefault(x => x.Id == id);
        var admin = _dbContext.Admins.FirstOrDefault(x => x.Id == id);
    }
}