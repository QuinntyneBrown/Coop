// Acceptance Test
// Traces to: L2-REQ-029, L2-REQ-089
// Description: A member adds photos to their own maintenance request through
// the API. The member's household and the office can read them, another
// member cannot, and the general asset routes do not serve them. Only
// JPEG, PNG and WebP photos up to 10 MB are accepted, and re-posting the
// same photo returns the existing one.

using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace Coop.Api.Tests;

public class MaintenancePhotosTests : IClassFixture<CoopApiFactory>
{
    private static readonly byte[] PngBytes = Convert.FromBase64String(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==");

    private readonly CoopApiFactory _factory;

    public MaintenancePhotosTests(CoopApiFactory factory) => _factory = factory;

    private static async Task<string> CreateRequestAsync(HttpClient member, string title)
    {
        var response = await member.PostAsJsonAsync("/api/maintenance-requests", new { title, description = "Water under the sink." });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        return (await response.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("id").GetString()!;
    }

    private static Task<HttpResponseMessage> UploadAsync(HttpClient client, string requestId, byte[] bytes, string fileName = "sink.png", string contentType = "image/png")
    {
        var content = new MultipartFormDataContent();
        var file = new ByteArrayContent(bytes);
        file.Headers.ContentType = new MediaTypeHeaderValue(contentType);
        content.Add(file, "file", fileName);
        return client.PostAsync($"/api/maintenance-requests/{requestId}/photos", content);
    }

    private static async Task<JsonElement> UploadOkAsync(HttpClient client, string requestId, byte[] bytes, string fileName = "sink.png")
    {
        var response = await UploadAsync(client, requestId, bytes, fileName);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        return (await response.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("photo");
    }

    [Fact]
    public async Task Given_a_member_adds_a_photo_then_the_request_shows_it_to_the_member_and_to_the_office()
    {
        var member = await _factory.CreateMemberClientAsync();
        var requestId = await CreateRequestAsync(member, "Leak under the sink");

        var photo = await UploadOkAsync(member, requestId, PngBytes);
        var url = photo.GetProperty("url").GetString()!;

        var mine = await member.GetFromJsonAsync<JsonElement>($"/api/maintenance-requests/{requestId}");
        Assert.Contains(mine.GetProperty("attachments").EnumerateArray(), a => a.GetProperty("url").GetString() == url);

        var ownView = await member.GetAsync(url);
        Assert.Equal(HttpStatusCode.OK, ownView.StatusCode);
        Assert.Equal("image/png", ownView.Content.Headers.ContentType!.MediaType);
        Assert.Equal(PngBytes, await ownView.Content.ReadAsByteArrayAsync());

        var admin = await _factory.CreateAdminClientAsync();
        var office = await admin.GetFromJsonAsync<JsonElement>($"/api/maintenancerequest/{requestId}");
        var assetId = office.GetProperty("maintenanceRequest").GetProperty("digitalAssets")[0].GetProperty("digitalAssetId").GetString();
        var officeView = await admin.GetAsync($"/api/maintenance-requests/{requestId}/photos/{assetId}");
        Assert.Equal(HttpStatusCode.OK, officeView.StatusCode);
    }

    [Fact]
    public async Task Given_another_member_when_they_request_the_photo_then_the_api_refuses()
    {
        var member = await _factory.CreateMemberClientAsync();
        var requestId = await CreateRequestAsync(member, "Cracked tile");
        var photo = await UploadOkAsync(member, requestId, PngBytes, "tile.png");
        var url = photo.GetProperty("url").GetString()!;
        var assetId = photo.GetProperty("photoId").GetString()!;

        var neighbour = await _factory.CreateNeighbourClientAsync();
        Assert.Equal(HttpStatusCode.Forbidden, (await neighbour.GetAsync(url)).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await UploadAsync(neighbour, requestId, PngBytes, "mine.png")).StatusCode);

        var anonymous = _factory.CreateAnonymousClient();
        Assert.Equal(HttpStatusCode.Unauthorized, (await anonymous.GetAsync(url)).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await anonymous.GetAsync($"/api/digitalasset/serve/{assetId}")).StatusCode);
    }

    [Fact]
    public async Task Given_a_file_that_is_not_a_photo_or_too_large_then_the_api_rejects_it()
    {
        var member = await _factory.CreateMemberClientAsync();
        var requestId = await CreateRequestAsync(member, "Noisy fan");

        var notPhoto = await UploadAsync(member, requestId, "hello"u8.ToArray(), "notes.txt", "text/plain");
        Assert.Equal(HttpStatusCode.BadRequest, notPhoto.StatusCode);
        Assert.Contains("Choose a JPEG, PNG or WebP photo.", await notPhoto.Content.ReadAsStringAsync());

        var tooLarge = await UploadAsync(member, requestId, new byte[10 * 1024 * 1024 + 1], "huge.png");
        Assert.Equal(HttpStatusCode.BadRequest, tooLarge.StatusCode);
        Assert.Contains("Choose a photo smaller than 10 MB.", await tooLarge.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task Given_the_same_photo_is_posted_twice_then_the_existing_photo_is_returned()
    {
        var member = await _factory.CreateMemberClientAsync();
        var requestId = await CreateRequestAsync(member, "Sticky window");

        var first = await UploadOkAsync(member, requestId, PngBytes, "window.png");
        var second = await UploadOkAsync(member, requestId, PngBytes, "window.png");

        Assert.Equal(first.GetProperty("photoId").GetString(), second.GetProperty("photoId").GetString());
        var view = await member.GetFromJsonAsync<JsonElement>($"/api/maintenance-requests/{requestId}");
        Assert.Single(view.GetProperty("attachments").EnumerateArray());
    }
}
