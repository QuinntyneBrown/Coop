using System.Text.Json;
using Coop.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.SiteContent.Queries.GetSiteContent;

public class GetSiteContentHandler : IRequestHandler<GetSiteContentRequest, GetSiteContentResponse>
{
    private readonly ICoopDbContext _context;
    public GetSiteContentHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetSiteContentResponse> Handle(GetSiteContentRequest request, CancellationToken cancellationToken)
    {
        var content = await _context.JsonContents.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Name == SiteContentRules.Name && !x.IsDeleted, cancellationToken);
        if (content is null || string.IsNullOrWhiteSpace(content.Json))
            return new GetSiteContentResponse();

        try
        {
            using var document = JsonDocument.Parse(content.Json);
            return document.RootElement.ValueKind == JsonValueKind.Object
                ? new GetSiteContentResponse { SiteContent = document.RootElement.Clone() }
                : new GetSiteContentResponse();
        }
        catch (JsonException)
        {
            return new GetSiteContentResponse();
        }
    }
}
