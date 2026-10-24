using Coop.Application.Common.Interfaces;
using MediatR;

namespace Coop.Application.CMS.SiteContent.Queries.GetSiteContent;

public class GetSiteContentHandler : IRequestHandler<GetSiteContentRequest, GetSiteContentResponse>
{
    private readonly ICoopDbContext _context;
    public GetSiteContentHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetSiteContentResponse> Handle(GetSiteContentRequest request, CancellationToken cancellationToken)
        => new() { SiteContent = await SiteContentStore.ReadAsync(_context, SiteContentRules.Name, cancellationToken) };
}
