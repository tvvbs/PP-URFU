﻿namespace WebApplication1.Database;

public class Company 
{
    public Guid Id { get; set; }
    public string? Login { get; set; }
    public string? Password { get; set; }
    public string? Name { get; set; }
}