using Coop.Application.Common.Interfaces;
using Coop.Application.CMS.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Themes.Queries.GetThemeByProfile;

public class GetThemeByProfileHandler : IRequestHandler<GetThemeByProfileRequest, GetThemeByProfileResponse>
{
    private readonly ICoopDbContext _context;
    public GetThemeByProfileHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetThemeByProfileResponse> Handle(GetThemeByProfileRequest request, CancellationToken cancellationToken)
    {
        var t = await _context.Themes.FirstOrDefaultAsync(x => x.ProfileId == request.ProfileId && !x.IsDeleted, cancellationToken);
        return new GetThemeByProfileResponse { Theme = t != null ? ThemeDto.FromTheme(t) : null };
    }
}
