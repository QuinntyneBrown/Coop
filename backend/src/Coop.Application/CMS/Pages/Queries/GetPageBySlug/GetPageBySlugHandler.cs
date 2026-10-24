using System.Security.Claims;
using Coop.Application.CMS.Dtos;
using Coop.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Pages.Queries.GetPageBySlug;

public class GetPageBySlugHandler : IRequestHandler<GetPageBySlugRequest, GetPageBySlugResponse>
{
    private readonly ICoopDbContext _context;
    private readonly ClaimsPrincipal _user;
    private readonly IPreviewTokenService _tokens;

    public GetPageBySlugHandler(ICoopDbContext context, ClaimsPrincipal user, IPreviewTokenService tokens)
    {
        _context = context;
        _user = user;
        _tokens = tokens;
    }

    public async Task<GetPageBySlugResponse> Handle(GetPageBySlugRequest request, CancellationToken cancellationToken)
    {
        var all = PageReadAccess.SeesUnpublished(_user, _tokens, request.PreviewToken);
        var page = await _context.Pages
            .FirstOrDefaultAsync(p => p.Slug == request.Slug && !p.IsDeleted && (all || p.Published), cancellationToken);

        return new GetPageBySlugResponse { Page = page != null ? PageDto.FromPage(page) : null };
    }
}
