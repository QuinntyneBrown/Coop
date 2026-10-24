using Coop.Application.CMS.Dtos;

namespace Coop.Application.CMS.SiteContent.Commands.SaveSiteContent;

public class SaveSiteContentResponse
{
    public SiteContentDto SiteContent { get; set; } = new();

    /// <summary>Always true after a save: the content now waits in the draft.</summary>
    public bool HasDraft { get; set; }
}
