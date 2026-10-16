// Acceptance Test
// Traces to: L2-REQ-102, L2-REQ-105
// Description: Each co-op's records stay inside it: lists, reads by slug or
// id, changes and removals from another co-op treat a record as missing,
// created records belong to the co-op the request is for, and assets and
// invitation tokens work only at their own co-op.

using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace Coop.Api.Tests;

public class CoopIsolationTests : IClassFixture<CoopApiFactory>
{
    private const string Birch = "birch";
    private const string BirchAdmin = "birchadmin";
    private const string BirchPassword = "Birch123!";

    private readonly CoopApiFactory _factory;

    public CoopIsolationTests(CoopApiFactory factory) => _factory = factory;

    private async Task<HttpClient> BirchAdminAsync()
    {
        await _factory.EnsureCoopAsync(Birch, BirchAdmin, BirchPassword);
        return await _factory.CreateClientAsAsync(BirchAdmin, BirchPassword, Birch);
    }

    private static async Task<JsonElement> CreatePageAsync(HttpClient admin, string title)
    {
        var response = await admin.PostAsJsonAsync("/api/pages", new { title, body = "<p>Our garden.</p>" });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        return (await response.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("page");
    }

    private static async Task<string[]> PageSlugsAsync(HttpClient client)
    {
        var json = await client.GetFromJsonAsync<JsonElement>("/api/pages");
        return json.GetProperty("pages").EnumerateArray().Select(p => p.GetProperty("slug").GetString()!).ToArray();
    }

    [Fact]
    public async Task Given_a_page_created_at_one_co_op_then_only_that_co_op_lists_and_serves_it()
    {
        var birch = await BirchAdminAsync();
        await CreatePageAsync(birch, "Birch rooftop garden");

        Assert.Contains("birch-rooftop-garden", await PageSlugsAsync(_factory.CreateClientForCoop(Birch)));
        Assert.DoesNotContain("birch-rooftop-garden", await PageSlugsAsync(_factory.CreateAnonymousClient()));
        Assert.Equal(HttpStatusCode.NotFound, (await _factory.CreateAnonymousClient().GetAsync("/api/pages/birch-rooftop-garden")).StatusCode);
    }

    [Fact]
    public async Task Given_the_seeded_co_op_then_its_pages_and_site_content_are_not_seen_at_another_co_op()
    {
        await BirchAdminAsync();
        var sunrise = await _factory.CreateAdminClientAsync();
        await CreatePageAsync(sunrise, "Sunrise library");

        Assert.DoesNotContain("sunrise-library", await PageSlugsAsync(_factory.CreateClientForCoop(Birch)));
        var seeded = await _factory.CreateAnonymousClient().GetFromJsonAsync<JsonElement>("/api/site-content");
        var atBirch = await _factory.CreateClientForCoop(Birch).GetAsync("/api/site-content");
        Assert.NotEqual(seeded.ToString(), await atBirch.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task Given_a_page_in_another_co_op_when_an_admin_changes_or_removes_it_by_id_then_it_is_unchanged()
    {
        var birch = await BirchAdminAsync();
        var page = await CreatePageAsync(birch, "Birch laundry room");
        var pageId = page.GetProperty("pageId").GetString();
        var sunrise = await _factory.CreateAdminClientAsync();

        var update = await sunrise.PutAsJsonAsync("/api/pages", new { pageId, title = "Taken over", body = "<p>Changed.</p>" });
        var remove = await sunrise.DeleteAsync($"/api/pages/{pageId}");

        Assert.NotEqual(HttpStatusCode.OK, update.StatusCode);
        Assert.NotEqual(HttpStatusCode.OK, remove.StatusCode);
        var stillThere = await _factory.CreateClientForCoop(Birch).GetFromJsonAsync<JsonElement>("/api/pages/birch-laundry-room");
        Assert.Equal("Birch laundry room", stillThere.GetProperty("page").GetProperty("title").GetString());
    }

    [Fact]
    public async Task Given_an_asset_uploaded_at_one_co_op_when_another_co_op_serves_it_then_the_api_answers_404()
    {
        var birch = await BirchAdminAsync();
        var form = new MultipartFormDataContent();
        var file = new ByteArrayContent(new byte[] { 0x89, 0x50, 0x4E, 0x47 });
        file.Headers.ContentType = new MediaTypeHeaderValue("image/png");
        form.Add(file, "file", "garden.png");
        var upload = await birch.PostAsync("/api/digitalasset/upload", form);
        Assert.Equal(HttpStatusCode.OK, upload.StatusCode);
        var assetId = (await upload.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("digitalAsset").GetProperty("digitalAssetId").GetString();

        Assert.Equal(HttpStatusCode.OK, (await _factory.CreateClientForCoop(Birch).GetAsync($"/api/digitalasset/serve/{assetId}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await _factory.CreateAnonymousClient().GetAsync($"/api/digitalasset/serve/{assetId}")).StatusCode);
    }

    [Fact]
    public async Task Given_an_invitation_token_of_the_seeded_co_op_when_it_is_used_at_another_co_op_then_it_is_refused()
    {
        await BirchAdminAsync();

        var atSunrise = await _factory.CreateAnonymousClient().GetFromJsonAsync<JsonElement>("/api/invitationtoken/validate/valid-invitation-token");
        var atBirch = await _factory.CreateClientForCoop(Birch).GetFromJsonAsync<JsonElement>("/api/invitationtoken/validate/valid-invitation-token");

        Assert.True(atSunrise.GetProperty("success").GetBoolean());
        Assert.False(atBirch.GetProperty("success").GetBoolean());
    }
}
