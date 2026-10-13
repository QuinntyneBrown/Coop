using Coop.Application.Common.Interfaces;
using Coop.Application.CMS.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Themes.Queries.GetDefaultTheme;

public class GetDefaultThemeHandler : IRequestHandler<GetDefaultThemeRequest, GetDefaultThemeResponse>
{
    private readonly ICoopDbContext _context;
    public GetDefaultThemeHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetDefaultThemeResponse> Handle(GetDefaultThemeRequest request, CancellationToken cancellationToken)
    {
        var t = await _context.Themes.FirstOrDefaultAsync(x => x.IsDefault && !x.IsDeleted, cancellationToken);
        return new GetDefaultThemeResponse { Theme = t != null ? ThemeDto.FromTheme(t) : null };
    }
}
