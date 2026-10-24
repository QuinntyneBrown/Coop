using System.Security.Claims;
using Coop.Application.CMS.Dtos;
using Coop.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Pages.Queries.GetPages;

public class GetPagesHandler : IRequestHandler<GetPagesRequest, GetPagesResponse>
{
    private readonly ICoopDbContext _context;
    private readonly ClaimsPrincipal _user;
    private readonly IPreviewTokenService _tokens;

    public GetPagesHandler(ICoopDbContext context, ClaimsPrincipal user, IPreviewTokenService tokens)
    {
        _context = context;
        _user = user;
        _tokens = tokens;
    }

    public async Task<GetPagesResponse> Handle(GetPagesRequest request, CancellationToken cancellationToken)
    {
        var all = PageReadAccess.SeesUnpublished(_user, _tokens, request.PreviewToken);
        var pages = await _context.Pages
            .Where(p => !p.IsDeleted && (all || p.Published))
            .OrderBy(p => p.CreatedOn)
            .ToListAsync(cancellationToken);

        return new GetPagesResponse { Pages = pages.Select(PageDto.FromPage).ToList() };
    }
}
