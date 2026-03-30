using Coop.Application.Common.Interfaces;
using Coop.Application.CMS.Dtos;
using Coop.Domain.CMS;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Themes.Commands.CreateTheme;

public class CreateThemeHandler : IRequestHandler<CreateThemeRequest, CreateThemeResponse>
{
    private readonly ICoopDbContext _context;
    public CreateThemeHandler(ICoopDbContext context) { _context = context; }

    public async Task<CreateThemeResponse> Handle(CreateThemeRequest request, CancellationToken cancellationToken)
    {
        var theme = new Theme { ProfileId = request.ProfileId, CssCustomProperties = request.CssCustomProperties, IsDefault = request.IsDefault };
        _context.Themes.Add(theme);
        await _context.SaveChangesAsync(cancellationToken);
        return new CreateThemeResponse { Theme = ThemeDto.FromTheme(theme) };
    }
}
