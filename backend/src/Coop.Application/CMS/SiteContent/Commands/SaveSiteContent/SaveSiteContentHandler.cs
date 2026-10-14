using System.Text.Json;
using Coop.Application.Common.Interfaces;
using Coop.Domain.CMS;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.SiteContent.Commands.SaveSiteContent;

public class SaveSiteContentHandler : IRequestHandler<SaveSiteContentRequest, SaveSiteContentResponse>
{
    private static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web);

    private readonly ICoopDbContext _context;
    public SaveSiteContentHandler(ICoopDbContext context) { _context = context; }

    public async Task<SaveSiteContentResponse> Handle(SaveSiteContentRequest request, CancellationToken cancellationToken)
    {
        var content = await _context.JsonContents
            .FirstOrDefaultAsync(x => x.Name == SiteContentRules.Name && !x.IsDeleted, cancellationToken);
        if (content is null)
        {
            content = new JsonContent { Name = SiteContentRules.Name };
            _context.JsonContents.Add(content);
        }

        content.Json = JsonSerializer.Serialize(request.SiteContent, Options);
        await _context.SaveChangesAsync(cancellationToken);

        return new SaveSiteContentResponse { SiteContent = request.SiteContent };
    }
}
