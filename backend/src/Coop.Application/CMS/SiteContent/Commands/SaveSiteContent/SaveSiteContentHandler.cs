using System.Text.Json;
using Coop.Application.Common.Interfaces;
using Coop.Domain.CMS;
using MediatR;

namespace Coop.Application.CMS.SiteContent.Commands.SaveSiteContent;

/// <summary>Writes the draft entry and leaves the published copy alone (L2-REQ-121 AC1, ADR 0018).</summary>
public class SaveSiteContentHandler : IRequestHandler<SaveSiteContentRequest, SaveSiteContentResponse>
{
    private static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web);

    private readonly ICoopDbContext _context;
    public SaveSiteContentHandler(ICoopDbContext context) { _context = context; }

    public async Task<SaveSiteContentResponse> Handle(SaveSiteContentRequest request, CancellationToken cancellationToken)
    {
        var draft = await SiteContentStore.FindAsync(_context, SiteContentRules.DraftName, cancellationToken);
        if (draft is null)
        {
            draft = new JsonContent { Name = SiteContentRules.DraftName };
            _context.JsonContents.Add(draft);
        }

        draft.Json = JsonSerializer.Serialize(request.SiteContent, Options);
        await _context.SaveChangesAsync(cancellationToken);

        return new SaveSiteContentResponse { SiteContent = request.SiteContent, HasDraft = true };
    }
}
