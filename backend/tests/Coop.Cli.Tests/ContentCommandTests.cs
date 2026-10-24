// Acceptance Test
// Traces to: L2-REQ-108, L2-REQ-127, L2-REQ-099, L2-REQ-080, L2-REQ-086, L2-REQ-040, L2-REQ-041, L2-REQ-042, L2-REQ-045
// Description: site content and board export and import as JSON, the site
// content draft published, discarded, exported and imported, pages, assets
// and themes through the same handlers and validators as the API, checked
// through the API.

using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;

namespace Coop.Cli.Tests;

public class ContentCommandTests : IClassFixture<CliTestHost>, IDisposable
{
    private readonly CliTestHost _host;
    private readonly string _folder = Directory.CreateTempSubdirectory("coop-cli-tests-").FullName;

    public ContentCommandTests(CliTestHost host) => _host = host;

    public void Dispose() => Directory.Delete(_folder, recursive: true);

    private string FileWith(string name, string text)
    {
        var path = Path.Combine(_folder, name);
        File.WriteAllText(path, text);
        return path;
    }

    private async Task<JsonNode> SiteContentAsync()
    {
        var body = await _host.CreateAnonymousClient().GetStringAsync("/api/site-content");
        return JsonNode.Parse(body)!["siteContent"]!;
    }

    /// <summary>The office's view: the draft when one exists, with hasDraft.</summary>
    private async Task<JsonNode> DraftAsync()
    {
        var admin = await _host.CreateClientAsAsync("admin", "Admin123!");
        return JsonNode.Parse(await admin.GetStringAsync("/api/site-content?draft=true"))!;
    }

    [Fact]
    public async Task Given_a_draft_when_the_operator_publishes_then_visitors_see_it_and_a_repeat_says_there_is_nothing_to_publish()
    {
        var content = (await SiteContentAsync()).DeepClone();
        content["home"]!["sections"]![0]!["title"] = "Published from the command line.";
        var imported = await _host.RunAsync("site-content", "import", "--file", FileWith("draft.json", content.ToJsonString()), "--draft");
        Assert.Equal(0, imported.ExitCode);
        Assert.Contains("The site content is saved as a draft. Run site-content publish to publish it.", imported.Output);
        Assert.True((await DraftAsync())["hasDraft"]!.GetValue<bool>());
        Assert.NotEqual("Published from the command line.", (await SiteContentAsync())["home"]!["sections"]![0]!["title"]!.GetValue<string>());

        var published = await _host.RunAsync("site-content", "publish");

        Assert.Equal(0, published.ExitCode);
        Assert.Contains("The site content is published.", published.Output);
        Assert.Equal("Published from the command line.", (await SiteContentAsync())["home"]!["sections"]![0]!["title"]!.GetValue<string>());
        Assert.False((await DraftAsync())["hasDraft"]!.GetValue<bool>());

        var again = await _host.RunAsync("site-content", "publish");
        Assert.Equal(0, again.ExitCode);
        Assert.Contains("There are no unpublished changes.", again.Output);
    }

    [Fact]
    public async Task Given_a_draft_when_the_operator_discards_it_then_the_published_content_stands_and_a_repeat_is_harmless()
    {
        var before = await SiteContentAsync();
        var content = before.DeepClone();
        content["header"]!["siteName"] = "Never published";
        Assert.Equal(0, (await _host.RunAsync("site-content", "import", "--file", FileWith("discard.json", content.ToJsonString()), "--draft")).ExitCode);

        var discarded = await _host.RunAsync("site-content", "discard");

        Assert.Equal(0, discarded.ExitCode);
        Assert.Contains("The unpublished changes were discarded.", discarded.Output);
        Assert.False((await DraftAsync())["hasDraft"]!.GetValue<bool>());
        Assert.True(JsonNode.DeepEquals(before, await SiteContentAsync()));

        var again = await _host.RunAsync("site-content", "discard");
        Assert.Equal(0, again.ExitCode);
        Assert.Contains("There are no unpublished changes.", again.Output);
    }

    [Fact]
    public async Task Given_a_draft_when_the_operator_exports_with_draft_then_the_draft_is_written_else_the_published_content()
    {
        var content = (await SiteContentAsync()).DeepClone();
        content["footer"]!["copyright"] = "Draft copyright";
        Assert.Equal(0, (await _host.RunAsync("site-content", "import", "--file", FileWith("export-draft.json", content.ToJsonString()), "--draft")).ExitCode);

        var draft = await _host.RunAsync("site-content", "export", "--draft");
        var published = await _host.RunAsync("site-content", "export");

        Assert.Equal(0, draft.ExitCode);
        Assert.Equal("Draft copyright", JsonNode.Parse(draft.Output)!["footer"]!["copyright"]!.GetValue<string>());
        Assert.True(JsonNode.DeepEquals(await SiteContentAsync(), JsonNode.Parse(published.Output)));

        Assert.Equal(0, (await _host.RunAsync("site-content", "discard")).ExitCode);
        var noDraft = await _host.RunAsync("site-content", "export", "--draft");
        Assert.True(JsonNode.DeepEquals(await SiteContentAsync(), JsonNode.Parse(noDraft.Output)));
    }

    [Fact]
    public async Task Given_published_site_content_when_the_operator_exports_it_then_the_json_matches_the_api()
    {
        var file = Path.Combine(_folder, "site.json");

        var result = await _host.RunAsync("site-content", "export", "--file", file);

        Assert.Equal(0, result.ExitCode);
        var exported = JsonNode.Parse(File.ReadAllText(file))!;
        Assert.True(JsonNode.DeepEquals(await SiteContentAsync(), exported));
        var printed = await _host.RunAsync("site-content", "export");
        Assert.True(JsonNode.DeepEquals(exported, JsonNode.Parse(printed.Output)));
    }

    [Fact]
    public async Task Given_edited_json_when_the_operator_imports_it_then_the_api_serves_it()
    {
        var content = await SiteContentAsync();
        content["header"]!["siteName"] = "OWN Housing Co-operative";
        content["home"]!["sections"]![0]!["title"] = "A home of our own.";

        var result = await _host.RunAsync("site-content", "import", "--file", FileWith("edited.json", content.ToJsonString()));

        Assert.Equal(0, result.ExitCode);
        Assert.Contains("The site content is published.", result.Output);
        var saved = await SiteContentAsync();
        Assert.Equal("OWN Housing Co-operative", saved["header"]!["siteName"]!.GetValue<string>());
        Assert.Equal("A home of our own.", saved["home"]!["sections"]![0]!["title"]!.GetValue<string>());
        Assert.False((await DraftAsync())["hasDraft"]!.GetValue<bool>());
    }

    [Fact]
    public async Task Given_json_that_breaks_a_rule_when_the_operator_imports_it_then_the_rule_is_printed_and_nothing_changes()
    {
        var before = await SiteContentAsync();
        var content = before.DeepClone();
        content["header"]!["visitLink"]!["href"] = "javascript:alert(1)";
        content["home"]!["sections"]![0]!["photo"]!["alt"] = "";

        var result = await _host.RunAsync("site-content", "import", "--file", FileWith("unsafe.json", content.ToJsonString()));

        Assert.Equal(1, result.ExitCode);
        Assert.Contains("Use a page on this site, a web address, an e-mail address or a phone number.", result.Error);
        Assert.Contains("Describe this photo for people who cannot see it", result.Error);
        Assert.True(JsonNode.DeepEquals(before, await SiteContentAsync()));
    }

    [Fact]
    public async Task Given_a_file_that_is_not_json_when_the_operator_imports_it_then_it_says_so()
    {
        var before = await SiteContentAsync();

        var result = await _host.RunAsync("site-content", "import", "--file", FileWith("broken.json", "{ not json"));

        Assert.Equal(1, result.ExitCode);
        Assert.Contains("is not valid JSON", result.Error);
        Assert.True(JsonNode.DeepEquals(before, await SiteContentAsync()));
    }

    [Fact]
    public async Task Given_a_board_list_when_the_operator_imports_and_exports_it_then_the_api_serves_it_in_order()
    {
        var board = """[{ "name": "Ada Brightwater", "title": "President", "photoUrl": "/own/portrait-1.svg" }, { "name": "Bea Fernsby", "title": "Treasurer", "photoUrl": null }]""";

        var result = await _host.RunAsync("board", "import", "--file", FileWith("board.json", board));

        Assert.Equal(0, result.ExitCode);
        var directors = (await _host.CreateAnonymousClient().GetFromJsonAsync<JsonElement>("/api/board-of-directors")).GetProperty("directors").EnumerateArray().ToArray();
        Assert.Equal(new[] { "Ada Brightwater", "Bea Fernsby" }, directors.Select(d => d.GetProperty("name").GetString()));
        var exported = JsonNode.Parse((await _host.RunAsync("board", "export")).Output)!.AsArray();
        Assert.Equal("Treasurer", exported[1]!["title"]!.GetValue<string>());

        var invalid = await _host.RunAsync("board", "import", "--file", FileWith("bad-board.json", """[{ "name": "", "title": "President" }]"""));
        Assert.Equal(1, invalid.ExitCode);
        Assert.Equal(2, (await _host.CreateAnonymousClient().GetFromJsonAsync<JsonElement>("/api/board-of-directors")).GetProperty("directors").GetArrayLength());
    }

    [Fact]
    public async Task Given_a_page_when_the_operator_creates_updates_and_removes_it_then_the_api_follows()
    {
        var body = FileWith("garden.html", "<p>Tomatoes and marigolds.</p>");
        var anonymous = _host.CreateAnonymousClient();

        var created = await _host.RunAsync("page", "create", "--title", "Our garden", "--body-file", body, "--hero-image-url", "/own/garden.svg", "--hero-image-alt", "Planters on the roof.");
        Assert.Equal(0, created.ExitCode);
        var page = (await anonymous.GetFromJsonAsync<JsonElement>("/api/pages/our-garden")).GetProperty("page");
        Assert.Equal("<p>Tomatoes and marigolds.</p>", page.GetProperty("body").GetString());
        Assert.Equal("Planters on the roof.", page.GetProperty("heroImageAlt").GetString());

        var repeated = await _host.RunAsync("page", "create", "--title", "Our garden", "--body-file", FileWith("other.html", "<p>Other.</p>"));
        Assert.Equal(0, repeated.ExitCode);
        Assert.Contains(page.GetProperty("pageId").GetString()!, repeated.Output);
        Assert.Contains("our-garden", (await _host.RunAsync("page", "list")).Output);

        var updated = await _host.RunAsync("page", "update", "--slug", "our-garden", "--title", "Our rooftop garden");
        Assert.Equal(0, updated.ExitCode);
        var renamed = (await anonymous.GetFromJsonAsync<JsonElement>("/api/pages/our-rooftop-garden")).GetProperty("page");
        Assert.Equal("<p>Tomatoes and marigolds.</p>", renamed.GetProperty("body").GetString());
        Assert.Equal("/own/garden.svg", renamed.GetProperty("heroImageUrl").GetString());

        Assert.Equal(0, (await _host.RunAsync("page", "remove", "--slug", "our-rooftop-garden")).ExitCode);
        Assert.Equal(HttpStatusCode.NotFound, (await anonymous.GetAsync("/api/pages/our-rooftop-garden")).StatusCode);
    }

    [Fact]
    public async Task Given_page_rules_when_the_operator_breaks_them_then_the_api_rules_are_printed()
    {
        var body = FileWith("page.html", "<p>Text.</p>");
        await _host.RunAsync("page", "create", "--title", "Laundry room", "--body-file", body);
        await _host.RunAsync("page", "create", "--title", "Guest suite", "--body-file", body);

        var clash = await _host.RunAsync("page", "update", "--slug", "guest-suite", "--title", "Laundry room");
        var noAlt = await _host.RunAsync("page", "create", "--title", "Bike room", "--body-file", body, "--hero-image-url", "/own/lobby.svg");
        var missing = await _host.RunAsync("page", "remove", "--slug", "no-such-page");

        Assert.Equal(1, clash.ExitCode);
        Assert.Contains("A page with this title already exists.", clash.Error);
        Assert.Equal(1, noAlt.ExitCode);
        Assert.Contains("Describe this photo for people who cannot see it", noAlt.Error);
        Assert.Equal(1, missing.ExitCode);
        Assert.Contains("No page at /pages/no-such-page.", missing.Error);
    }

    [Fact]
    public async Task Given_a_file_when_the_operator_uploads_lists_and_removes_it_then_the_api_serves_it_until_it_is_removed()
    {
        var bytes = new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 1, 2, 3 };
        var path = Path.Combine(_folder, "notice-board.png");
        File.WriteAllBytes(path, bytes);

        var uploaded = await _host.RunAsync("asset", "upload", "--file", path);

        Assert.Equal(0, uploaded.ExitCode);
        var id = Regex.Match(uploaded.Output, "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}").Value;
        Assert.Contains($"/api/digitalasset/serve/{id}", uploaded.Output);
        var served = await _host.CreateAnonymousClient().GetAsync($"/api/digitalasset/serve/{id}");
        Assert.Equal("image/png", served.Content.Headers.ContentType?.MediaType);
        Assert.Equal(bytes, await served.Content.ReadAsByteArrayAsync());
        Assert.Matches($@"{id}\s+notice-board.png\s+image/png\s+11 B", (await _host.RunAsync("asset", "list")).Output);

        Assert.Equal(0, (await _host.RunAsync("asset", "remove", "--id", id)).ExitCode);
        Assert.DoesNotContain(id, (await _host.RunAsync("asset", "list")).Output);
        var missing = await _host.RunAsync("asset", "remove", "--id", Guid.NewGuid().ToString());
        Assert.Equal(1, missing.ExitCode);
        Assert.Contains("No asset with the id", missing.Error);
    }

    [Fact]
    public async Task Given_css_declarations_when_the_operator_creates_updates_and_removes_a_theme_then_the_api_follows()
    {
        var css = FileWith("theme.css", "--primary-color: #2F6B4F; --text-color: #1A1918");

        var created = await _host.RunAsync("theme", "create", "--css-file", css, "--default");

        Assert.Equal(0, created.ExitCode);
        var id = Regex.Match(created.Output, "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}").Value;
        var admin = await _host.CreateClientAsAsync("admin", "Admin123!");
        var theme = (await admin.GetFromJsonAsync<JsonElement>("/api/theme/default")).GetProperty("theme");
        Assert.Equal("--primary-color: #2F6B4F; --text-color: #1A1918", theme.GetProperty("cssCustomProperties").GetString());
        Assert.Contains(id, (await _host.RunAsync("theme", "list")).Output);

        var update = FileWith("theme2.css", "--primary-color: #7A3E65");
        Assert.Equal(0, (await _host.RunAsync("theme", "update", "--id", id, "--css-file", update, "--default")).ExitCode);
        theme = (await admin.GetFromJsonAsync<JsonElement>($"/api/theme/{id}")).GetProperty("theme");
        Assert.Equal("--primary-color: #7A3E65", theme.GetProperty("cssCustomProperties").GetString());

        Assert.Equal(0, (await _host.RunAsync("theme", "remove", "--id", id)).ExitCode);
        Assert.DoesNotContain(id, (await _host.RunAsync("theme", "list")).Output);
    }
}
