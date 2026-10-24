using MediatR;

namespace Coop.Application.CMS.Pages.Queries.GetPageBySlug;

/// <summary>A page by its address; an unpublished page only for the office or a valid preview token (L2-REQ-123 AC5, L2-REQ-125 AC3).</summary>
public class GetPageBySlugRequest : IRequest<GetPageBySlugResponse>
{
    public string Slug { get; set; } = string.Empty;
    public string? PreviewToken { get; set; }
}
