using Coop.Application.Common.Interfaces;
using MediatR;

namespace Coop.Application.CMS.SiteContent.Commands.DiscardSiteContentDraft;

public class DiscardSiteContentDraftHandler : IRequestHandler<DiscardSiteContentDraftRequest, DiscardSiteContentDraftResponse>
{
    private readonly ICoopDbContext _context;
    public DiscardSiteContentDraftHandler(ICoopDbContext context) { _context = context; }

    public async Task<DiscardSiteContentDraftResponse> Handle(DiscardSiteContentDraftRequest request, CancellationToken cancellationToken)
    {
        var draft = await SiteContentStore.FindAsync(_context, SiteContentRules.DraftName, cancellationToken);
        if (draft is not null)
        {
            _context.JsonContents.Remove(draft);
            await _context.SaveChangesAsync(cancellationToken);
        }

        return new DiscardSiteContentDraftResponse
        {
            SiteContent = await SiteContentStore.ReadAsync(_context, SiteContentRules.Name, cancellationToken),
        };
    }
}
