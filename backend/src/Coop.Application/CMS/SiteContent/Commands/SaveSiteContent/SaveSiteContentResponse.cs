using Coop.Application.CMS.Dtos;

namespace Coop.Application.CMS.SiteContent.Commands.SaveSiteContent;

public class SaveSiteContentResponse
{
    public SiteContentDto SiteContent { get; set; } = new();
}
