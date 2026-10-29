using System.Text.Json;
using Coop.Application.CMS.Dtos;
using Coop.Domain.CMS;

namespace Coop.Application.CMS.Pages;

/// <summary>
/// The body blocks of a page as JSON in the entity and as DTOs in the API
/// (L2-REQ-123). A body without blocks becomes one Existing content block
/// (AC4); a page may have no blocks. A page with French for its title or
/// photo description stores <c>{ "blocks": [...], "fr": {...} }</c> instead
/// of the bare list, and both forms are read (L2-REQ-129 AC2, ADR 0023).
/// </summary>
public static class PageSections
{
    private static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web)
    {
        AllowOutOfOrderMetadataProperties = true,
    };

    public static string Serialize(IEnumerable<PageBlockDto> blocks)
        => JsonSerializer.Serialize(blocks.ToList(), Options);

    /// <summary>The blocks, with the page's own French when it has any.</summary>
    public static string Serialize(IEnumerable<PageBlockDto> blocks, Dictionary<string, JsonElement>? fr)
        => fr is { Count: > 0 }
            ? JsonSerializer.Serialize(new StoredSections { Blocks = blocks.ToList(), Fr = fr }, Options)
            : Serialize(blocks);

    /// <summary>The blocks of a page; a page whose JSON cannot be read, or that still holds a body, shows that body as one block.</summary>
    public static List<PageBlockDto> Parse(Page page)
        => string.IsNullOrWhiteSpace(page.Body) ? Read(page.Sections).Blocks : FromBody(page.Body);

    /// <summary>The French of the page's title and photo description, or null when it has none.</summary>
    public static Dictionary<string, JsonElement>? French(Page page)
        => string.IsNullOrWhiteSpace(page.Body) ? Read(page.Sections).Fr : null;

    private static StoredSections Read(string sections)
    {
        try
        {
            return sections.TrimStart().StartsWith('{')
                ? JsonSerializer.Deserialize<StoredSections>(sections, Options) ?? new StoredSections()
                : new StoredSections { Blocks = JsonSerializer.Deserialize<List<PageBlockDto>>(sections, Options) ?? new List<PageBlockDto>() };
        }
        catch (JsonException)
        {
            return new StoredSections();
        }
    }

    /// <summary>One Existing content block holding the body, or no block for an empty body.</summary>
    public static List<PageBlockDto> FromBody(string? body)
        => string.IsNullOrWhiteSpace(body)
            ? new List<PageBlockDto>()
            : new List<PageBlockDto> { new HtmlBlockDto { Html = body } };

    /// <summary>The blocks a request carries, else its body as one block (L2-REQ-123 AC4).</summary>
    public static List<PageBlockDto> From(List<PageBlockDto>? sections, string? body)
        => sections is { Count: > 0 } ? sections : FromBody(body);

    /// <summary>The <c>Sections</c> column of a page that has French of its own.</summary>
    private class StoredSections
    {
        public List<PageBlockDto> Blocks { get; set; } = new();
        public Dictionary<string, JsonElement>? Fr { get; set; }
    }
}
