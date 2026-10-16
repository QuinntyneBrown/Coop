// Acceptance Test
// Traces to: L2-REQ-103
// Description: An account belongs to one co-op: its token names that co-op,
// it signs in only there, a token works only at its own co-op, a token with
// no co-op is refused, and an account registered at a co-op belongs to it.

using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Coop.Domain.Identity;
using Coop.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Coop.Api.Tests;

public class CoopSignInTests : IClassFixture<CoopApiFactory>
{
    private const string Birch = "birch";
    private const string BirchAdmin = "birchadmin";
    private const string BirchPassword = "Birch123!";

    private readonly CoopApiFactory _factory;

    public CoopSignInTests(CoopApiFactory factory) => _factory = factory;

    private static JsonElement PayloadOf(string token)
    {
        var payload = token.Split('.')[1].Replace('-', '+').Replace('_', '/');
        payload = payload.PadRight(payload.Length + (4 - payload.Length % 4) % 4, '=');
        return JsonDocument.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(payload))).RootElement;
    }

    private static Task<HttpResponseMessage> SignInAsync(HttpClient client, string username, string password) =>
        client.PostAsJsonAsync("/api/user/token", new { username, password });

    private async Task<Guid> TenantIdOfAsync(string slug)
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<CoopDbContext>();
        return (await context.Tenants.SingleAsync(t => t.Slug == slug)).TenantId;
    }

    [Fact]
    public async Task Given_an_account_in_a_co_op_when_it_signs_in_there_then_the_token_names_that_co_op()
    {
        var response = await SignInAsync(_factory.CreateAnonymousClient(), CoopApiFactory.AdminUsername, CoopApiFactory.AdminPassword);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var token = (await response.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("accessToken").GetString()!;
        Assert.Equal((await TenantIdOfAsync(CoopApiFactory.DefaultTenant)).ToString(), PayloadOf(token).GetProperty("tenant_id").GetString());
    }

    [Fact]
    public async Task Given_an_account_in_one_co_op_when_it_signs_in_at_another_then_it_fails_as_a_wrong_password_does()
    {
        await _factory.EnsureCoopAsync(Birch, BirchAdmin, BirchPassword);

        var wrongPassword = await SignInAsync(_factory.CreateAnonymousClient(), CoopApiFactory.AdminUsername, "Wrong123!");
        var otherCoop = await SignInAsync(_factory.CreateClientForCoop(Birch), CoopApiFactory.AdminUsername, CoopApiFactory.AdminPassword);

        Assert.NotEqual(HttpStatusCode.OK, otherCoop.StatusCode);
        Assert.Equal(wrongPassword.StatusCode, otherCoop.StatusCode);
    }

    [Fact]
    public async Task Given_a_token_from_one_co_op_when_it_is_sent_to_another_then_the_api_answers_401()
    {
        await _factory.EnsureCoopAsync(Birch, BirchAdmin, BirchPassword);
        var sunrise = await _factory.CreateAdminClientAsync();
        var atBirch = _factory.CreateClientForCoop(Birch);
        atBirch.DefaultRequestHeaders.Authorization = sunrise.DefaultRequestHeaders.Authorization;

        var anonymousRoute = await atBirch.GetAsync("/api/pages");
        var create = await atBirch.PostAsJsonAsync("/api/pages", new { title = "Slipped in", body = "<p>No.</p>" });

        Assert.Equal(HttpStatusCode.Unauthorized, anonymousRoute.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, create.StatusCode);
        var pages = await _factory.CreateClientForCoop(Birch).GetFromJsonAsync<JsonElement>("/api/pages");
        Assert.DoesNotContain(pages.GetProperty("pages").EnumerateArray(), p => p.GetProperty("slug").GetString() == "slipped-in");
    }

    [Fact]
    public async Task Given_a_token_with_no_co_op_when_it_is_sent_then_the_api_answers_401()
    {
        string token;
        using (var scope = _factory.Services.CreateScope())
        {
            var tokens = scope.ServiceProvider.GetRequiredService<ITokenProvider>();
            token = tokens.Get(CoopApiFactory.AdminUsername, new[] { new Claim("Privilege", "Delete:Page") });
        }
        var client = _factory.CreateAnonymousClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await client.GetAsync("/api/pages");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Given_a_person_registers_at_a_co_op_then_the_account_belongs_to_that_co_op()
    {
        await _factory.EnsureCoopAsync(Birch, BirchAdmin, BirchPassword);
        var birchAdmin = await _factory.CreateClientAsAsync(BirchAdmin, BirchPassword, Birch);
        var invite = await birchAdmin.PostAsJsonAsync("/api/invitationtoken", new { value = "birch-welcome", type = 0 });
        Assert.Equal(HttpStatusCode.OK, invite.StatusCode);

        var register = await _factory.CreateClientForCoop(Birch).PostAsJsonAsync("/api/user/register",
            new { invitationToken = "birch-welcome", username = "edna", password = "Edna1234!" });

        Assert.Equal(HttpStatusCode.OK, register.StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await SignInAsync(_factory.CreateClientForCoop(Birch), "edna", "Edna1234!")).StatusCode);
        Assert.NotEqual(HttpStatusCode.OK, (await SignInAsync(_factory.CreateAnonymousClient(), "edna", "Edna1234!")).StatusCode);
    }
}
