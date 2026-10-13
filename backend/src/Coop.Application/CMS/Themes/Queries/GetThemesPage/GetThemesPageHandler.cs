using Coop.Application.Common.Interfaces;
using Coop.Application.CMS.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Themes.Queries.GetThemesPage;

public class GetThemesPageHandler : IRequestHandler<GetThemesPageRequest, GetThemesPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetThemesPageHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetThemesPageResponse> Handle(GetThemesPageRequest request, CancellationToken cancellationToken)
    {
        var q = _context.Themes.Where(t => !t.IsDeleted);
        var tc = await q.CountAsync(cancellationToken);
        var ts = await q.Skip(request.Index * request.PageSize).Take(request.PageSize).ToListAsync(cancellationToken);
        return new GetThemesPageResponse { Themes = ts.Select(ThemeDto.FromTheme).ToList(), TotalCount = tc, PageSize = request.PageSize, PageIndex = request.Index };
    }
}
