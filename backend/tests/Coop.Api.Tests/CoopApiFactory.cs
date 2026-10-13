using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Coop.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Coop.Api.Tests;

/// <summary>
/// Hosts the real API over an in-memory database (ADR 0003). Each factory
/// instance owns one database, seeded by the API's own startup seed.
/// </summary>
public class CoopApiFactory : WebApplicationFactory<Program>
{
    private readonly string _databaseName = $"coop-tests-{Guid.NewGuid()}";

    public const string AdminUsername = "admin";
    public const string AdminPassword = "Admin123!";
    public const string MemberUsername = "member";
    public const string MemberPassword = "Member123!";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // EF Core keeps the SQLite configuration in IDbContextOptionsConfiguration; drop it with the options.
            services.RemoveAll<IDbContextOptionsConfiguration<CoopDbContext>>();
            services.RemoveAll<DbContextOptions<CoopDbContext>>();
            services.RemoveAll<DbContextOptions>();
            services.AddDbContext<CoopDbContext>(options => options.UseInMemoryDatabase(_databaseName));
        });
    }

    public HttpClient CreateAnonymousClient() => CreateClient();

    public async Task<HttpClient> CreateClientAsAsync(string username, string password)
    {
        var client = CreateClient();
        var response = await client.PostAsJsonAsync("/api/user/token", new { username, password });
        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        var token = body.GetProperty("accessToken").GetString();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return client;
    }

    public Task<HttpClient> CreateAdminClientAsync() => CreateClientAsAsync(AdminUsername, AdminPassword);

    public Task<HttpClient> CreateMemberClientAsync() => CreateClientAsAsync(MemberUsername, MemberPassword);
}
