using System.Text.Json;

namespace Coop.Application.CMS.SiteContent.Queries.GetSiteContentPreview;

public class GetSiteContentPreviewResponse
{
    public JsonElement? SiteContent { get; set; }
}
