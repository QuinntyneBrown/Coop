using Coop.Application.Common.Interfaces;
using MediatR;

namespace Coop.Application.CMS.SiteContent.Queries.GetSiteContentDraft;

public class GetSiteContentDraftHandler : IRequestHandler<GetSiteContentDraftRequest, GetSiteContentDraftResponse>
{
    private readonly ICoopDbContext _context;
    public GetSiteContentDraftHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetSiteContentDraftResponse> Handle(GetSiteContentDraftRequest request, CancellationToken cancellationToken)
    {
        var draft = await SiteContentStore.ReadAsync(_context, SiteContentRules.DraftName, cancellationToken);
        if (draft is not null)
            return new GetSiteContentDraftResponse { SiteContent = draft, HasDraft = true };

        return new GetSiteContentDraftResponse
        {
            SiteContent = await SiteContentStore.ReadAsync(_context, SiteContentRules.Name, cancellationToken),
            HasDraft = false,
        };
    }
}
