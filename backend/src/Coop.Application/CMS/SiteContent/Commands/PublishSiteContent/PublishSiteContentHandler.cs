using Coop.Application.Common.Interfaces;
using Coop.Domain.CMS;
using MediatR;

namespace Coop.Application.CMS.SiteContent.Commands.PublishSiteContent;

public class PublishSiteContentHandler : IRequestHandler<PublishSiteContentRequest, PublishSiteContentResponse>
{
    private readonly ICoopDbContext _context;
    public PublishSiteContentHandler(ICoopDbContext context) { _context = context; }

    public async Task<PublishSiteContentResponse> Handle(PublishSiteContentRequest request, CancellationToken cancellationToken)
    {
        var draft = await SiteContentStore.FindAsync(_context, SiteContentRules.DraftName, cancellationToken);
        if (draft is null)
        {
            return new PublishSiteContentResponse
            {
                SiteContent = await SiteContentStore.ReadAsync(_context, SiteContentRules.Name, cancellationToken),
            };
        }

        var published = await SiteContentStore.FindAsync(_context, SiteContentRules.Name, cancellationToken);
        if (published is null)
        {
            published = new JsonContent { Name = SiteContentRules.Name };
            _context.JsonContents.Add(published);
        }

        published.Json = draft.Json;
        _context.JsonContents.Remove(draft);
        await _context.SaveChangesAsync(cancellationToken);

        return new PublishSiteContentResponse { SiteContent = SiteContentStore.Parse(published.Json) };
    }
}
