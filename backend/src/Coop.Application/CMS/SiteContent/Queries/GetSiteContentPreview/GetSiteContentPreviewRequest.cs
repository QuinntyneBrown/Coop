using MediatR;

namespace Coop.Application.CMS.SiteContent.Queries.GetSiteContentPreview;

/// <summary>The draft, else the published copy, for anyone holding a valid preview token (L2-REQ-125 AC2).</summary>
public class GetSiteContentPreviewRequest : IRequest<GetSiteContentPreviewResponse>
{
    public string? Token { get; set; }
}
