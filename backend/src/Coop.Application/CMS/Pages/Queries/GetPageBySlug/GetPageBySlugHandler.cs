using Coop.Application.CMS.Dtos;
using Coop.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Pages.Queries.GetPageBySlug;

public class GetPageBySlugHandler : IRequestHandler<GetPageBySlugRequest, GetPageBySlugResponse>
{
    private readonly ICoopDbContext _context;
    public GetPageBySlugHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetPageBySlugResponse> Handle(GetPageBySlugRequest request, CancellationToken cancellationToken)
    {
        var page = await _context.Pages
            .FirstOrDefaultAsync(p => p.Slug == request.Slug && !p.IsDeleted, cancellationToken);

        return new GetPageBySlugResponse { Page = page != null ? PageDto.FromPage(page) : null };
    }
}
