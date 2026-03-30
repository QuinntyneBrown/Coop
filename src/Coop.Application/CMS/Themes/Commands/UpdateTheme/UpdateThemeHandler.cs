using Coop.Application.Common.Interfaces;
using Coop.Application.CMS.Dtos;
using Coop.Domain.CMS;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Themes.Commands.UpdateTheme;

public class UpdateThemeHandler : IRequestHandler<UpdateThemeRequest, UpdateThemeResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateThemeHandler(ICoopDbContext context) { _context = context; }

    public async Task<UpdateThemeResponse> Handle(UpdateThemeRequest request, CancellationToken cancellationToken)
    {
        var theme = await _context.Themes.SingleAsync(t => t.ThemeId == request.ThemeId, cancellationToken);
        theme.CssCustomProperties = request.CssCustomProperties;
        theme.IsDefault = request.IsDefault;
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateThemeResponse { Theme = ThemeDto.FromTheme(theme) };
    }
}
