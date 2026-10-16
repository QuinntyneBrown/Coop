using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Security.Cryptography;
using Coop.Api.Tenancy;
using Coop.Application.Common.Interfaces;
using Coop.Domain.Identity;
using Coop.Domain.Profiles;
using Coop.Domain.Tenancy;
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

    /// <summary>True keeps notices in <see cref="Notices"/>; a test of the real sender turns it off.</summary>
    protected virtual bool RecordNotices => true;

    /// <summary>The platform's base domain in the tests; each co-op is a sub-domain of it.</summary>
    public const string BaseDomain = "coop.example";

    /// <summary>The co-op the seed creates, used for hosts outside the base domain.</summary>
    public const string DefaultTenant = "sunrise";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseSetting("Tenancy:BaseDomain", BaseDomain);
        builder.UseSetting("Tenancy:DefaultTenant", DefaultTenant);
        builder.ConfigureServices(services =>
        {
            // EF Core keeps the SQLite configuration in IDbContextOptionsConfiguration; drop it with the options.
            services.RemoveAll<IDbContextOptionsConfiguration<CoopDbContext>>();
            services.RemoveAll<DbContextOptions<CoopDbContext>>();
            services.RemoveAll<DbContextOptions>();
            services.AddDbContext<CoopDbContext>(options => options.UseInMemoryDatabase(_databaseName));
            if (RecordNotices)
            {
                services.RemoveAll<INoticeSender>();
                services.AddSingleton<INoticeSender>(Notices);
            }
        });
    }

    public HttpClient CreateAnonymousClient() => CreateClient();

    /// <summary>An anonymous client whose requests go to the given co-op's sub-domain.</summary>
    public HttpClient CreateClientForCoop(string slug) =>
        CreateClient(new WebApplicationFactoryClientOptions { BaseAddress = new Uri($"http://{slug}.{BaseDomain}") });

    public async Task<HttpClient> CreateClientAsAsync(string username, string password, string? coop = null)
    {
        var client = coop is null ? CreateClient() : CreateClientForCoop(coop);
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
        using (var scope = await CreateCoopScopeAsync())
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

    /// <summary>A service scope whose database reads and writes are inside the seeded co-op.</summary>
    public async Task<IServiceScope> CreateCoopScopeAsync(string slug = DefaultTenant)
    {
        var scope = Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<CoopDbContext>();
        scope.ServiceProvider.GetRequiredService<TenantContext>().Set(await context.Tenants.SingleAsync(t => t.Slug == slug));
        return scope;
    }

    /// <summary>
    /// Adds a second fictional co-op, once, with a SystemAdministrator role and
    /// one administrator account, all saved inside that co-op.
    /// </summary>
    public async Task EnsureCoopAsync(string slug, string adminUsername, string adminPassword)
    {
        using var scope = Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<CoopDbContext>();
        var tenant = await context.Tenants.SingleOrDefaultAsync(t => t.Slug == slug);
        if (tenant is null)
        {
            tenant = new Tenant { Slug = slug, Name = $"{slug} Co-op (test)" };
            context.Tenants.Add(tenant);
            await context.SaveChangesAsync();
        }
        scope.ServiceProvider.GetRequiredService<TenantContext>().Set(tenant);
        if (await context.Users.AnyAsync(u => u.Username == adminUsername))
            return;

        var role = await context.Roles.SingleOrDefaultAsync(r => r.Name == Constants.Roles.SystemAdministrator);
        if (role is null)
        {
            role = new Role { Name = Constants.Roles.SystemAdministrator };
            foreach (var aggregate in Constants.Aggregates.All)
                role.AddPrivilege(new Privilege { AccessRight = AccessRight.Delete, Aggregate = aggregate });
            context.Roles.Add(role);
        }
        var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
        var salt = RandomNumberGenerator.GetBytes(16);
        var user = new User { Username = adminUsername, Salt = salt, Password = hasher.HashPassword(salt, adminPassword) };
        user.Roles.Add(role);
        context.Users.Add(user);
        await context.SaveChangesAsync();
    }
}
