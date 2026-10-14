using System.Text.Json;

namespace Coop.Application.CMS.SiteContent.Queries.GetSiteContent;

/// <summary>
/// The stored content as it is, so a value an older entry lacks stays absent
/// and the public site shows its built-in default for that value (L2-REQ-098 AC3).
/// Null when there is no entry.
/// </summary>
public class GetSiteContentResponse
{
    public JsonElement? SiteContent { get; set; }
}
