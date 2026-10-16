// Acceptance Test
// Traces to: L2-REQ-041
// Description: Listed digital assets carry their size in bytes, so the admin
// screen can show it in plain units.

using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace Coop.Api.Tests;

public class DigitalAssetsTests : IClassFixture<CoopApiFactory>
{
    private readonly CoopApiFactory _factory;

    public DigitalAssetsTests(CoopApiFactory factory) => _factory = factory;

    [Fact]
    public async Task Given_an_uploaded_file_when_assets_are_listed_then_each_shows_its_size_in_bytes()
    {
        var admin = await _factory.CreateAdminClientAsync();
        var content = new MultipartFormDataContent();
        var file = new ByteArrayContent(new byte[2048]);
        file.Headers.ContentType = new MediaTypeHeaderValue("text/plain");
        content.Add(file, "file", "two-kilobytes.txt");
        var upload = await admin.PostAsync("/api/digitalasset/upload", content);
        Assert.Equal(HttpStatusCode.OK, upload.StatusCode);
        var id = (await upload.Content.ReadFromJsonAsync<JsonElement>())
            .GetProperty("digitalAsset").GetProperty("digitalAssetId").GetString();

        var page = await admin.GetFromJsonAsync<JsonElement>("/api/digitalasset/page/100/0");

        var listed = page.GetProperty("digitalAssets").EnumerateArray()
            .Single(a => a.GetProperty("digitalAssetId").GetString() == id);
        Assert.Equal(2048, listed.GetProperty("size").GetInt32());
    }
}
