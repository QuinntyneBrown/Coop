using Coop.Application.CMS.Dtos;
using Coop.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Pages.Queries.GetPages;

public class GetPagesHandler : IRequestHandler<GetPagesRequest, GetPagesResponse>
{
    private readonly ICoopDbContext _context;
    public GetPagesHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetPagesResponse> Handle(GetPagesRequest request, CancellationToken cancellationToken)
    {
        var pages = await _context.Pages
            .Where(p => !p.IsDeleted)
            .OrderBy(p => p.CreatedOn)
            .ToListAsync(cancellationToken);

        return new GetPagesResponse { Pages = pages.Select(PageDto.FromPage).ToList() };
    }
}
