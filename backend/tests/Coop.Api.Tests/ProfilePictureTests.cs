// Acceptance Test
// Traces to: L2-REQ-016, L2-REQ-091
// Description: A member sets, replaces and removes the picture on their own
// profile through the API. The office may change it too, another member may
// not. Only JPEG, PNG and WebP pictures up to 10 MB are accepted, a replaced
// or removed picture is no longer served, re-posting or re-removing returns
// the profile unchanged. (Showing it beside messages left with the public
// messaging page and is deferred for the admin, ADR 0012.)

using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace Coop.Api.Tests;

public class ProfilePictureTests : IClassFixture<CoopApiFactory>
{
    private static readonly byte[] PngBytes = Convert.FromBase64String(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==");

    private static readonly byte[] OtherPngBytes = Convert.FromBase64String(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==");

    private readonly CoopApiFactory _factory;

    public ProfilePictureTests(CoopApiFactory factory) => _factory = factory;

    private static async Task<string> OwnProfileIdAsync(HttpClient client)
        => (await client.GetFromJsonAsync<JsonElement>("/api/user/profile")).GetProperty("id").GetString()!;

    private static async Task<string> OwnAvatarUrlAsync(HttpClient client)
        => (await client.GetFromJsonAsync<JsonElement>("/api/user/profile")).GetProperty("avatarUrl").GetString()!;

    private static Task<HttpResponseMessage> UploadAsync(HttpClient client, string profileId, byte[] bytes, string fileName = "me.png", string contentType = "image/png")
    {
        var content = new MultipartFormDataContent();
        var file = new ByteArrayContent(bytes);
        file.Headers.ContentType = new MediaTypeHeaderValue(contentType);
        content.Add(file, "file", fileName);
        return client.PostAsync($"/api/profiles/{profileId}/avatar", content);
    }

    private static async Task<string> UploadOkAsync(HttpClient client, string profileId, byte[] bytes, string fileName = "me.png")
    {
        var response = await UploadAsync(client, profileId, bytes, fileName);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var url = (await response.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("profile").GetProperty("avatarUrl").GetString();
        Assert.False(string.IsNullOrEmpty(url));
        return url!;
    }

    [Fact]
    public async Task Given_a_member_when_they_save_a_picture_then_their_profile_shows_it_after_reload()
    {
        var member = await _factory.CreateMemberClientAsync();
        var profileId = await OwnProfileIdAsync(member);

        var url = await UploadOkAsync(member, profileId, PngBytes);

        Assert.Equal(url, await OwnAvatarUrlAsync(member));
        var served = await _factory.CreateAnonymousClient().GetAsync(url);
        Assert.Equal(HttpStatusCode.OK, served.StatusCode);
        Assert.Equal(PngBytes, await served.Content.ReadAsByteArrayAsync());
    }

    [Fact]
    public async Task Given_a_member_when_they_change_another_members_picture_then_the_api_refuses()
    {
        var member = await _factory.CreateMemberClientAsync();
        var neighbour = await _factory.CreateNeighbourClientAsync();
        var neighbourProfileId = await OwnProfileIdAsync(neighbour);
        var assetId = (await (await UploadAsync(neighbour, neighbourProfileId, PngBytes, "nora.png"))
            .Content.ReadFromJsonAsync<JsonElement>()).GetProperty("profile").GetProperty("avatarDigitalAssetId").GetString();

        Assert.Equal(HttpStatusCode.Forbidden, (await UploadAsync(member, neighbourProfileId, OtherPngBytes)).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await member.DeleteAsync($"/api/profiles/{neighbourProfileId}/avatar")).StatusCode);
        var put = await member.PutAsJsonAsync("/api/profiles/avatar", new { profileId = neighbourProfileId, digitalAssetId = assetId });
        Assert.Equal(HttpStatusCode.Forbidden, put.StatusCode);
    }

    [Fact]
    public async Task Given_the_office_when_it_sets_a_members_picture_then_it_is_saved()
    {
        var neighbour = await _factory.CreateNeighbourClientAsync();
        var admin = await _factory.CreateAdminClientAsync();
        var profileId = await OwnProfileIdAsync(neighbour);

        var url = await UploadOkAsync(admin, profileId, OtherPngBytes, "office.png");

        Assert.Equal(url, await OwnAvatarUrlAsync(neighbour));
    }

    [Theory]
    [InlineData("notes.pdf", "application/pdf", 20, "Choose a JPEG, PNG or WebP photo.")]
    [InlineData("big.png", "image/png", 10 * 1024 * 1024 + 1, "Choose a photo smaller than 10 MB.")]
    [InlineData("empty.png", "image/png", 0, "Choose a photo smaller than 10 MB.")]
    public async Task Given_a_file_that_is_not_an_allowed_picture_when_it_is_posted_then_the_api_rejects_it(string fileName, string contentType, int length, string message)
    {
        var member = await _factory.CreateMemberClientAsync();
        var profileId = await OwnProfileIdAsync(member);

        var response = await UploadAsync(member, profileId, new byte[length], fileName, contentType);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Contains(message, await response.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task Given_a_picture_when_it_is_replaced_and_then_removed_then_the_old_pictures_are_no_longer_served()
    {
        var neighbour = await _factory.CreateNeighbourClientAsync();
        var profileId = await OwnProfileIdAsync(neighbour);
        var anonymous = _factory.CreateAnonymousClient();
        var first = await UploadOkAsync(neighbour, profileId, PngBytes, "first.png");

        var second = await UploadOkAsync(neighbour, profileId, OtherPngBytes, "second.png");

        Assert.NotEqual(first, second);
        Assert.Equal(HttpStatusCode.NotFound, (await anonymous.GetAsync(first)).StatusCode);

        var removed = await neighbour.DeleteAsync($"/api/profiles/{profileId}/avatar");

        Assert.Equal(HttpStatusCode.OK, removed.StatusCode);
        Assert.Equal("", await OwnAvatarUrlAsync(neighbour));
        Assert.Equal(HttpStatusCode.NotFound, (await anonymous.GetAsync(second)).StatusCode);
    }

    [Fact]
    public async Task Given_the_same_picture_is_posted_twice_or_removed_twice_then_the_profile_is_returned_unchanged()
    {
        var member = await _factory.CreateMemberClientAsync();
        var profileId = await OwnProfileIdAsync(member);
        var first = await UploadOkAsync(member, profileId, PngBytes, "again.png");

        var second = await UploadOkAsync(member, profileId, PngBytes, "again.png");

        Assert.Equal(first, second);
        Assert.Equal(HttpStatusCode.OK, (await member.DeleteAsync($"/api/profiles/{profileId}/avatar")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await member.DeleteAsync($"/api/profiles/{profileId}/avatar")).StatusCode);
        Assert.Equal("", await OwnAvatarUrlAsync(member));
    }
}
