// Acceptance Test
// Traces to: L2-REQ-104
// Description: Usernames and page slugs are unique within a co-op only: two
// co-ops can each have the same username and the same page slug, and a
// username check looks only within the co-op it is asked at.

using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace Coop.Api.Tests;

public class CoopNamesTests : IClassFixture<CoopApiFactory>
{
    private const string Birch = "birch";
    private const string BirchAdmin = "birchadmin";
    private const string BirchPassword = "Birch123!";

    private readonly CoopApiFactory _factory;

    public CoopNamesTests(CoopApiFactory factory) => _factory = factory;

    private async Task<HttpClient> BirchAdminAsync()
    {
        await _factory.EnsureCoopAsync(Birch, BirchAdmin, BirchPassword);
        return await _factory.CreateClientAsAsync(BirchAdmin, BirchPassword, Birch);
    }

    [Fact]
    public async Task Given_a_username_in_one_co_op_when_another_co_op_creates_it_then_each_signs_in_with_its_own_password()
    {
        var birch = await BirchAdminAsync();

        var create = await birch.PostAsJsonAsync("/api/user", new { username = CoopApiFactory.AdminUsername, password = "BirchOwn123!" });

        Assert.Equal(HttpStatusCode.OK, create.StatusCode);
        await _factory.CreateClientAsAsync(CoopApiFactory.AdminUsername, "BirchOwn123!", Birch);
        await _factory.CreateAdminClientAsync();
    }

    [Fact]
    public async Task Given_a_username_only_in_another_co_op_when_it_is_checked_then_it_is_available()
    {
        await BirchAdminAsync();

        var atSunrise = await _factory.CreateAnonymousClient().GetFromJsonAsync<JsonElement>($"/api/user/exists/{CoopApiFactory.MemberUsername}");
        var atBirch = await _factory.CreateClientForCoop(Birch).GetFromJsonAsync<JsonElement>($"/api/user/exists/{CoopApiFactory.MemberUsername}");

        Assert.True(atSunrise.GetProperty("exists").GetBoolean());
        Assert.False(atBirch.GetProperty("exists").GetBoolean());
    }

    [Fact]
    public async Task Given_both_co_ops_add_a_page_with_the_same_title_then_each_site_shows_its_own_page()
    {
        var birch = await BirchAdminAsync();
        var sunrise = await _factory.CreateAdminClientAsync();

        Assert.Equal(HttpStatusCode.OK, (await sunrise.PostAsJsonAsync("/api/pages", new { title = "Community room", body = "<p>Sunrise room.</p>" })).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await birch.PostAsJsonAsync("/api/pages", new { title = "Community room", body = "<p>Birch room.</p>" })).StatusCode);

        var atSunrise = await _factory.CreateAnonymousClient().GetFromJsonAsync<JsonElement>("/api/pages/community-room");
        var atBirch = await _factory.CreateClientForCoop(Birch).GetFromJsonAsync<JsonElement>("/api/pages/community-room");
        Assert.Equal("<p>Sunrise room.</p>", atSunrise.GetProperty("page").GetProperty("body").GetString());
        Assert.Equal("<p>Birch room.</p>", atBirch.GetProperty("page").GetProperty("body").GetString());
    }
}
