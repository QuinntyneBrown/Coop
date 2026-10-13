using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Security.Cryptography;
using Coop.Application.Common.Interfaces;
using Coop.Domain.Identity;
using Coop.Domain.Profiles;
using Coop.Infrastructure.Persistence;
using Coop.SharedKernel;
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

    /// <summary>The notices the API sent, kept instead of leaving the system.</summary>
    public RecordingNoticeSender Notices { get; } = new();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // EF Core keeps the SQLite configuration in IDbContextOptionsConfiguration; drop it with the options.
            services.RemoveAll<IDbContextOptionsConfiguration<CoopDbContext>>();
            services.RemoveAll<DbContextOptions<CoopDbContext>>();
            services.RemoveAll<DbContextOptions>();
            services.AddDbContext<CoopDbContext>(options => options.UseInMemoryDatabase(_databaseName));
            services.RemoveAll<INoticeSender>();
            services.AddSingleton<INoticeSender>(Notices);
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

    /// <summary>
    /// Signs in as a member of another household, seeding that fictional
    /// member with the Member role and profile on first use.
    /// </summary>
    public async Task<HttpClient> CreateNeighbourClientAsync()
    {
        const string username = "neighbour";
        const string password = "Neighbour123!";
        using (var scope = Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<CoopDbContext>();
            if (!await context.Users.AnyAsync(u => u.Username == username))
            {
                var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
                var salt = RandomNumberGenerator.GetBytes(16);
                var user = new User { Username = username, Salt = salt, Password = hasher.HashPassword(salt, password) };
                user.Roles.Add(await context.Roles.SingleAsync(r => r.Name == Constants.Roles.Member));
                context.Users.Add(user);
                context.Members.Add(new Member { UserId = user.UserId, Firstname = "Nora", Lastname = "Neighbour", UnitNumber = "102" });
                await context.SaveChangesAsync();
            }
        }
        return await CreateClientAsAsync(username, password);
    }
}
