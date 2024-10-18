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
    
    public void SendNotification(Guid id, NotificationType notificationType, string jsonData)
    {
        _dbContext.Notifications.Add(new Notification()
        {
            Id = Guid.NewGuid(),
            JsonData = jsonData,
            Receiver = id,
            Type = notificationType,
            IsRead = false
        });
    }
}