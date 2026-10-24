using Coop.Application.Common.Interfaces;
using MediatR;

namespace Coop.Application.CMS.SiteContent.Queries.GetSiteContentPreview;

public class GetSiteContentPreviewHandler : IRequestHandler<GetSiteContentPreviewRequest, GetSiteContentPreviewResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IPreviewTokenService _tokens;

    public GetSiteContentPreviewHandler(ICoopDbContext context, IPreviewTokenService tokens)
    {
        _context = context;
        _tokens = tokens;
    }

    public async Task<GetSiteContentPreviewResponse> Handle(GetSiteContentPreviewRequest request, CancellationToken cancellationToken)
    {
        if (!_tokens.IsValid(request.Token))
            throw new UnauthorizedAccessException("This preview link has expired.");

        var content = await SiteContentStore.ReadAsync(_context, SiteContentRules.DraftName, cancellationToken)
            ?? await SiteContentStore.ReadAsync(_context, SiteContentRules.Name, cancellationToken);
        return new GetSiteContentPreviewResponse { SiteContent = content };
    }
}
