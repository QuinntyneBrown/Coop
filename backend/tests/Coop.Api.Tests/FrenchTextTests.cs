// Acceptance Test
// Traces to: L2-REQ-129
// Description: The French text of the site content and of website pages
// through the API: an `fr` object on any item that holds text is drafted,
// published and read back; a page keeps its French title, photo description
// and block texts while its address still comes from the English title;
// French that is not text, or is too long, is refused; content without
// French reads as before.

using System.Net;
using System.Net.Http.Json;
using System.Text.Json.Nodes;

namespace Coop.Api.Tests;

public class FrenchTextTests
{
    private static async Task<JsonObject> PublishedAsync(CoopApiFactory factory)
        => (await factory.CreateAnonymousClient().GetFromJsonAsync<JsonObject>("/api/site-content"))!["siteContent"]!.AsObject();

    private static Task<HttpResponseMessage> SaveAsync(HttpClient client, JsonNode siteContent)
        => client.PutAsJsonAsync("/api/site-content", new JsonObject { ["siteContent"] = siteContent.DeepClone() });

    private static JsonObject Hero(JsonNode content) => content["home"]!["sections"]![0]!.AsObject();

    [Fact]
    public async Task Given_french_on_the_header_a_link_a_section_and_a_photo_then_it_is_drafted_published_and_read_by_visitors()
    {
        await using var factory = new CoopApiFactory();
        var admin = await factory.CreateAdminClientAsync();
        var content = await PublishedAsync(factory);
        content["header"]!["fr"] = new JsonObject { ["siteSubtitle"] = "Coopérative d'habitation" };
        content["header"]!["menuLinks"]![0]!["fr"] = new JsonObject { ["label"] = "Accueil" };
        var hero = Hero(content);
        hero["fr"] = new JsonObject { ["title"] = "Bienvenue chez vous" };
        hero["photo"]!["fr"] = new JsonObject { ["alt"] = "Le jardin sur le toit." };

        var saved = await SaveAsync(admin, content);
        Assert.Equal(HttpStatusCode.OK, saved.StatusCode);
        var draft = (await admin.GetFromJsonAsync<JsonObject>("/api/site-content?draft=true"))!["siteContent"]!;
        Assert.Equal("Bienvenue chez vous", Hero(draft)["fr"]!["title"]!.GetValue<string>());
        Assert.Null(Hero(await PublishedAsync(factory))["fr"]);

        (await admin.PostAsync("/api/site-content/publish", null)).EnsureSuccessStatusCode();

        var published = await PublishedAsync(factory);
        Assert.Equal("Coopérative d'habitation", published["header"]!["fr"]!["siteSubtitle"]!.GetValue<string>());
        Assert.Equal("Accueil", published["header"]!["menuLinks"]![0]!["fr"]!["label"]!.GetValue<string>());
        Assert.Equal("Bienvenue chez vous", Hero(published)["fr"]!["title"]!.GetValue<string>());
        Assert.Equal("Le jardin sur le toit.", Hero(published)["photo"]!["fr"]!["alt"]!.GetValue<string>());
    }

    [Fact]
    public async Task Given_content_without_french_then_it_reads_without_an_fr_object()
    {
        await using var factory = new CoopApiFactory();
        var admin = await factory.CreateAdminClientAsync();
        var content = await PublishedAsync(factory);
        content["header"]!.AsObject().Remove("fr");
        content["header"]!["menuLinks"]![0]!.AsObject().Remove("fr");

        (await SaveAsync(admin, content)).EnsureSuccessStatusCode();

        var draft = (await admin.GetFromJsonAsync<JsonObject>("/api/site-content?draft=true"))!["siteContent"]!;
        Assert.False(draft["header"]!.AsObject().ContainsKey("fr"));
        Assert.False(draft["header"]!["menuLinks"]![0]!.AsObject().ContainsKey("fr"));
    }

    public static TheoryData<string, JsonNode> InvalidFrench => new()
    {
        { "a number", new JsonObject { ["title"] = 3 } },
        { "an object", new JsonObject { ["title"] = new JsonObject { ["text"] = "Bonjour" } } },
        { "a long text", new JsonObject { ["title"] = new string('a', 2001) } },
        { "a long checklist line", new JsonObject { ["items"] = new JsonArray(new string('a', 2001)) } },
    };

    [Theory]
    [MemberData(nameof(InvalidFrench))]
    public async Task Given_french_that_is_not_text_or_is_too_long_then_the_save_is_refused_and_nothing_changes(string reason, JsonNode french)
    {
        await using var factory = new CoopApiFactory();
        var admin = await factory.CreateAdminClientAsync();
        var content = await PublishedAsync(factory);
        Hero(content)["fr"] = french.DeepClone();

        var response = await SaveAsync(admin, content);

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest, reason);
        Assert.Contains("Keep each French text under 2000 characters.", await response.Content.ReadAsStringAsync());
        var draft = (await admin.GetFromJsonAsync<JsonObject>("/api/site-content?draft=true"))!;
        Assert.False(draft["hasDraft"]!.GetValue<bool>());
    }

    [Fact]
    public async Task Given_a_page_with_french_then_visitors_read_it_and_the_address_comes_from_the_english_title()
    {
        await using var factory = new CoopApiFactory();
        var admin = await factory.CreateAdminClientAsync();

        var response = await admin.PostAsJsonAsync("/api/pages", new JsonObject
        {
            ["title"] = "How to apply",
            ["published"] = true,
            ["heroImageUrl"] = "/own/garden.svg",
            ["heroImageAlt"] = "The rooftop garden.",
            ["fr"] = new JsonObject { ["title"] = "Comment faire une demande", ["heroImageAlt"] = "Le jardin sur le toit." },
            ["sections"] = new JsonArray
            {
                new JsonObject { ["kind"] = "heading", ["text"] = "Who can apply", ["fr"] = new JsonObject { ["text"] = "Qui peut faire une demande" } },
                new JsonObject { ["kind"] = "bullets", ["items"] = new JsonArray("Women aged 55 or over."), ["fr"] = new JsonObject { ["items"] = new JsonArray("Les femmes de 55 ans ou plus.") } },
                new JsonObject { ["kind"] = "paragraph", ["text"] = "Send the form to the office." },
            },
        });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var page = (await factory.CreateAnonymousClient().GetFromJsonAsync<JsonObject>("/api/pages/how-to-apply"))!["page"]!;
        Assert.Equal("How to apply", page["title"]!.GetValue<string>());
        Assert.Equal("Comment faire une demande", page["fr"]!["title"]!.GetValue<string>());
        Assert.Equal("Le jardin sur le toit.", page["fr"]!["heroImageAlt"]!.GetValue<string>());
        var sections = page["sections"]!.AsArray();
        Assert.Equal("Qui peut faire une demande", sections[0]!["fr"]!["text"]!.GetValue<string>());
        Assert.Equal("Les femmes de 55 ans ou plus.", sections[1]!["fr"]!["items"]![0]!.GetValue<string>());
        Assert.Null(sections[2]!["fr"]);

        var listed = (await factory.CreateAnonymousClient().GetFromJsonAsync<JsonObject>("/api/pages"))!["pages"]!.AsArray();
        Assert.Contains(listed, p => p!["fr"]?["title"]?.GetValue<string>() == "Comment faire une demande");
    }

    [Fact]
    public async Task Given_a_page_update_with_long_french_then_it_is_refused_and_the_page_is_unchanged()
    {
        await using var factory = new CoopApiFactory();
        var admin = await factory.CreateAdminClientAsync();
        var created = (await (await admin.PostAsJsonAsync("/api/pages", new JsonObject { ["title"] = "Our garden", ["published"] = true }))
            .Content.ReadFromJsonAsync<JsonObject>())!["page"]!;

        var response = await admin.PutAsJsonAsync("/api/pages", new JsonObject
        {
            ["pageId"] = created["pageId"]!.GetValue<string>(),
            ["title"] = "Our garden",
            ["published"] = true,
            ["sections"] = new JsonArray(new JsonObject { ["kind"] = "paragraph", ["text"] = "Come and see.", ["fr"] = new JsonObject { ["text"] = new string('a', 2001) } }),
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Contains("Keep each French text under 2000 characters.", await response.Content.ReadAsStringAsync());
        var page = (await admin.GetFromJsonAsync<JsonObject>("/api/pages/our-garden"))!["page"]!;
        Assert.Empty(page["sections"]!.AsArray());
    }
}
