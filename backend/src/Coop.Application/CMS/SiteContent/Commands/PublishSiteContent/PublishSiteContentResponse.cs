using System.Text.Json;

namespace Coop.Application.CMS.SiteContent.Commands.PublishSiteContent;

public class PublishSiteContentResponse
{
    /// <summary>The published copy after the publish.</summary>
    public JsonElement? SiteContent { get; set; }

    /// <summary>Always false after a publish; kept so the admin's publish bar reads one shape.</summary>
    public bool HasDraft { get; set; }
}
