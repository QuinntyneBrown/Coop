using Coop.Application.Common.Interfaces;
using Coop.Application.CMS.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Themes.Queries.GetThemeById;

public class GetThemeByIdHandler : IRequestHandler<GetThemeByIdRequest, GetThemeByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetThemeByIdHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetThemeByIdResponse> Handle(GetThemeByIdRequest request, CancellationToken cancellationToken)
    {
        var t = await _context.Themes.SingleAsync(x => x.ThemeId == request.ThemeId, cancellationToken);
        return new GetThemeByIdResponse { Theme = ThemeDto.FromTheme(t) };
    }
}
