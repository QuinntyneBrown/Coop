using MediatR;

namespace Coop.Application.CMS.Pages.Queries.GetPages;

/// <summary>Published pages only, unless the caller is the office or holds a valid preview token (L2-REQ-123 AC5, L2-REQ-125 AC3).</summary>
public class GetPagesRequest : IRequest<GetPagesResponse>
{
    public string? PreviewToken { get; set; }
}
