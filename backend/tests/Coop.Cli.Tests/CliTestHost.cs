using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Coop.Application.Common.Interfaces;
using Coop.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Coop.Cli.Tests;

/// <summary>
/// Hosts the real API and runs the command-line tool in process over one
/// shared in-memory database (ADR 0003, ADR 0012). Each host owns one
/// database, seeded by the API's own startup seed when the API first starts.
/// </summary>
public class CliTestHost : WebApplicationFactory<Program>
{
    private readonly string _databaseName = $"coop-cli-tests-{Guid.NewGuid()}";
    private readonly InMemoryDatabaseRoot _databaseRoot = new();

    /// <summary>The notices the API or the tool sent, kept instead of leaving the system.</summary>
    public RecordingNoticeSender Notices { get; } = new();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(UseTestDatabase);
    }

    private void UseTestDatabase(IServiceCollection services)
    {
        // EF Core keeps the SQLite configuration in IDbContextOptionsConfiguration; drop it with the options.
        services.RemoveAll<IDbContextOptionsConfiguration<CoopDbContext>>();
        services.RemoveAll<DbContextOptions<CoopDbContext>>();
        services.RemoveAll<DbContextOptions>();
        services.AddDbContext<CoopDbContext>(options => options.UseInMemoryDatabase(_databaseName, _databaseRoot));
        services.RemoveAll<INoticeSender>();
        services.AddSingleton<INoticeSender>(Notices);
    }

    /// <summary>Runs the tool with the given arguments against this host's database.</summary>
    public async Task<CliResult> RunAsync(params string[] args)
    {
        // Start the API first, so its startup seed has run before the tool changes the database.
        _ = Server;
        var output = new StringWriter();
        var error = new StringWriter();
        var exitCode = await CliApp.RunAsync(args, output, error, UseTestDatabase);
        return new CliResult(exitCode, output.ToString(), error.ToString());
    }

    public HttpClient CreateAnonymousClient() => CreateClient();

    /// <summary>Signs in through <c>POST /api/user/token</c>; returns null when the API refuses.</summary>
    public async Task<string?> SignInAsync(string username, string password)
    {
        var response = await CreateClient().PostAsJsonAsync("/api/user/token", new { username, password });
        if (!response.IsSuccessStatusCode)
            return null;
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        return body.GetProperty("accessToken").GetString();
    }

    public async Task<HttpClient> CreateClientAsAsync(string username, string password)
    {
        var token = await SignInAsync(username, password)
            ?? throw new InvalidOperationException($"{username} could not sign in.");
        var client = CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return client;
    }
}

public record CliResult(int ExitCode, string Output, string Error);
