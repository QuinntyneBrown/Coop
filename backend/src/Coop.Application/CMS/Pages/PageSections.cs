using System.Text.Json;
using Coop.Application.CMS.Dtos;
using Coop.Domain.CMS;

namespace Coop.Application.CMS.Pages;

/// <summary>
/// The body blocks of a page as JSON in the entity and as DTOs in the API
/// (L2-REQ-123). A body without blocks becomes one Existing content block
/// (AC4); a page may have no blocks.
/// </summary>
public static class PageSections
{
    private static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web)
    {
        AllowOutOfOrderMetadataProperties = true,
    };

    public static string Serialize(IEnumerable<PageBlockDto> blocks)
        => JsonSerializer.Serialize(blocks.ToList(), Options);

    /// <summary>The blocks of a page; a page whose JSON cannot be read, or that still holds a body, shows that body as one block.</summary>
    public static List<PageBlockDto> Parse(Page page)
    {
        if (!string.IsNullOrWhiteSpace(page.Body))
            return FromBody(page.Body);
        try
        {
            return JsonSerializer.Deserialize<List<PageBlockDto>>(page.Sections, Options) ?? new List<PageBlockDto>();
        }
        catch (JsonException)
        {
            return new List<PageBlockDto>();
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
}
