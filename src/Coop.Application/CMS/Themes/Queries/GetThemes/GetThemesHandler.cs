using Coop.Application.Common.Interfaces;
using Coop.Application.CMS.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Themes.Queries.GetThemes;

public class GetThemesHandler : IRequestHandler<GetThemesRequest, GetThemesResponse>
{
    private readonly ICoopDbContext _context;
    public GetThemesHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetThemesResponse> Handle(GetThemesRequest request, CancellationToken cancellationToken)
    {
        var ts = await _context.Themes.Where(t => !t.IsDeleted).ToListAsync(cancellationToken);
        return new GetThemesResponse { Themes = ts.Select(ThemeDto.FromTheme).ToList() };
    }
}
