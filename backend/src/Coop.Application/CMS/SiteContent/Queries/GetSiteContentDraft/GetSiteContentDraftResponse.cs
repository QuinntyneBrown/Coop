using System.Text.Json;

namespace Coop.Application.CMS.SiteContent.Queries.GetSiteContentDraft;

public class GetSiteContentDraftResponse
{
    public JsonElement? SiteContent { get; set; }

    /// <summary>True when <see cref="SiteContent"/> is the unpublished draft.</summary>
    public bool HasDraft { get; set; }
}
