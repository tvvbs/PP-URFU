using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Database;

namespace WebApplication1.Controllers;

[ApiController]
[Route("[controller]")]
public class NotificationsController : MyController
{

    public NotificationsController(PracticeDbContext dbContext) : base(dbContext)
    {
    }
    
    
    [Authorize]
    [HttpGet("get-all")]
    [ProducesResponseType(200, Type = typeof(List<Notification>))]
    public IResult GetNotifications()
    {
        var currentUserId = this.User.GetCurrentUserId();
        var notifications = _dbContext.Notifications.Where(x => x.Receiver == currentUserId || x.Receiver == Guid.Empty).ToList();
        return Results.Ok(notifications);
    }
    
    [Authorize]
    [HttpPost("mark-read/{id:guid}")]
    public IResult MarkRead(Guid id)
    {
        var notification = _dbContext.Notifications.FirstOrDefault(x => x.Id == id);
        if (notification is null)
            return Results.BadRequest("Уведомление не найдено");
        
        notification.IsRead = true;
        _dbContext.SaveChanges();
        return Results.Ok();
    }
}