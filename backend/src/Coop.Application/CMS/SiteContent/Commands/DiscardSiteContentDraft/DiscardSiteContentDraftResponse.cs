using System.Text.Json;

namespace Coop.Application.CMS.SiteContent.Commands.DiscardSiteContentDraft;

public class DiscardSiteContentDraftResponse
{
    /// <summary>The published copy, which the office now edits.</summary>
    public JsonElement? SiteContent { get; set; }

    /// <summary>Always false after a discard; kept so the admin's publish bar reads one shape.</summary>
    public bool HasDraft { get; set; }
}
