using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using System.Collections.Generic;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Stockage en mémoire des logs
var logs = new List<LogEntry>();

// Test simple
app.MapGet("/", () => "Service C# OK");

// Endpoint pour ajouter un log depuis Processing
app.MapPost("/logs/add", async (HttpContext context) =>
{
    var log = await context.Request.ReadFromJsonAsync<LogEntry>();
    if (log != null)
    {
        logs.Add(log);
        return Results.Ok(new { status = "ok", total = logs.Count });
    }
    return Results.BadRequest(new { status = "error", message = "Invalid JSON" });
});

// Endpoint pour récupérer tous les logs
app.MapGet("/logs/all", () => logs);

app.Run();

public class LogEntry
{
    public string Timestamp { get; set; } = "";
    public string Level { get; set; } = "";
    public string Message { get; set; } = "";
}
