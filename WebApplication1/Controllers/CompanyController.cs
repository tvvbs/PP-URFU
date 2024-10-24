﻿using System.ComponentModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Database;
using File = WebApplication1.Database.File;

namespace WebApplication1.Controllers;
[ApiController]
[Route("[controller]")]
public class CompanyController : MyController
{
    private NotificationService _notificationService;

    public CompanyController(PracticeDbContext dbContext, NotificationService notificationService, LinkGenerator linkGenerator) : base(dbContext)
    {
        _notificationService = notificationService;
    }

    [Authorize]
    [HttpGet("get-all")]
    [ProducesResponseType(200, Type = typeof(List<Company>))]
    public IResult GetAll()
    {
        return Results.Ok(_dbContext.Companies.ToList());
    }

    [Authorize]
    [HttpGet("get/{id:guid}")]
    [ProducesResponseType(200, Type = typeof(Company))]
    public IResult GetCompany(Guid id)
    {
        var company =_dbContext.Companies.FirstOrDefault(x => x.Id == id);
        if (company is null)
            return Results.Problem("Компания не найдена");
        
        return Results.Ok(company);
    }
    
    public record CompanyViewModel(Guid? Id, string? Name, string? Login, string? Password);
    [Authorize(Roles = $"{nameof(Company)},{nameof(Admin)}")]
    [HttpPost("edit")]
    public IResult EditCompany([FromBody] CompanyViewModel viewModel)
    {
        if (viewModel.Id is null)
            return Results.Problem("Не указан идентификатор");
        
        var company = _dbContext.Companies.FirstOrDefault(x => x.Id == viewModel.Id);
        if (company is null)
            return Results.Problem("Компания не найдена");
        
        company.Name = viewModel.Name;
        company.Login = viewModel.Login;
        company.Password = viewModel.Password;
        
        _dbContext.SaveChanges();
        return Results.Ok();
    }
    
    
    
    private async Task<File> DbFileFromIFormFile(IFormFile file)
    {
        var stream = new MemoryStream();
        await file.CopyToAsync(stream);
        
        var dbFile = new File()
        {
            Id = Guid.NewGuid(),
            Name = file.FileName,
            Data = stream.ToArray()
        };
        
        return dbFile;
    }
    public record VacancyResponseViewModel(Guid? StudentId, Guid? VacancyId, string? Text, IFormFile Resume);
    [Authorize(Roles = nameof(Student))]
    [HttpPost("respond-to-vacancy")]
    public async Task<IResult> RespondToVacancy([FromForm] VacancyResponseViewModel vacancyResponse)
    {
        if (_dbContext.VacancyResponses.IncludeAllRecursively().Any(x => x.Student.Id == vacancyResponse.StudentId && x.Vacancy.Id == vacancyResponse.VacancyId))
        {
            return Results.Problem("Вы уже откликались на вакансию");
        }
        var student = _dbContext.Students.IncludeAllRecursively().FirstOrDefault(x => x.Id == vacancyResponse.StudentId);
        if (student is null)
            return Results.Problem("Студент не найден");
        
        var vacancy = _dbContext.Vacancies.IncludeAllRecursively().FirstOrDefault(x => x.Id == vacancyResponse.VacancyId);
        if (vacancy is null)
            return Results.Problem("Вакансия не найдена");
        
        var response = new VacancyResponse
        {
            Id = Guid.NewGuid(),
            Status = VacancyResponseStatus.Pending,
            Vacancy = vacancy,
            Student = student,
            Text = vacancyResponse.Text,
            Resume = await DbFileFromIFormFile(vacancyResponse.Resume)
        };
        _dbContext.VacancyResponses.Add(response);
        _dbContext.SaveChanges();
        
        return Results.Ok();
    }
    
    public class EditVacancyResponseStatusViewModel
    {
        public Guid? ResponseId { get; set; }
        public VacancyResponseStatus? Status { get; set; }
        
        public DateTime DateTime { get; set; }
    }

    [Authorize(Roles = $"{nameof(Company)},{nameof(Admin)}")]
    [HttpPost("edit-vacancy-response-status")]
    public IResult EditVacancyResponseStatus([FromBody] EditVacancyResponseStatusViewModel viewModel)
    {
        var response = _dbContext.VacancyResponses.IncludeAllRecursively().FirstOrDefault(x => x.Id == viewModel.ResponseId);
        if (response is null)
            return Results.Problem("Отклик не найден");
        
        if (response.Status == VacancyResponseStatus.InvitedToInterview)
        {
            return Results.Problem("Вы не можете изменить статус приглашенного на собеседование");
        }
        if (response.Status == VacancyResponseStatus.Declined)
        {
            return Results.Problem("Вы не можете изменить статус отклоненного");
        }
        if (response.Status == viewModel.Status)
        {
            return Results.Problem("Статус уже установлен");
        }
        
        response.Status = viewModel.Status;
        if (viewModel.Status == VacancyResponseStatus.InvitedToInterview)
        {
            _notificationService.SendNotification(response.Student.Id,
                                                  NotificationType.FreeForm,
                                                  $"Вы приглашены на собеседование по вакансии {response.Vacancy.Name} проверьте свой календарь собеседований");
            // get interviews for this vacancy 
            var companyInterviews = _dbContext.Interviews.IncludeAllRecursively().Where(x => x.Vacancy.Id == response.Vacancy.Id).ToList();
            // get interviews for this student
            var studentInterviews = companyInterviews.Where(x => x.Student.Id == response.Student.Id).ToList();
            
            // calculate date for interview so that doesnt intersects in day with vacancy interviews and student interviews. Be aware that there may be no interviews at all
            var date = viewModel.DateTime.ToUniversalTime();
            
            if (companyInterviews.Any(x => x.DateTime.Date == date.Date) || studentInterviews.Any(x => x.DateTime.Date == date.Date) || date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
            {
                return Results.Problem("Этот день уже занят",statusCode:409,title:"Невозможно назначить собеседование");
            }
            // add new interview to db
            var interview = new Interview
            {
                Id = Guid.NewGuid(),
                DateTime = date,
                Student = response.Student,
                Vacancy = response.Vacancy,
                VacancyResponse = response
            };
            _dbContext.Interviews.Add(interview);
            
        }
        if (viewModel.Status == VacancyResponseStatus.Declined)
        {
            _notificationService.SendNotification(response.Student.Id, NotificationType.FreeForm, $"Ваша заявка на вакансию {response.Vacancy.Name} отклонена");
        }
        _dbContext.SaveChanges();
        return Results.Ok();
    }
}