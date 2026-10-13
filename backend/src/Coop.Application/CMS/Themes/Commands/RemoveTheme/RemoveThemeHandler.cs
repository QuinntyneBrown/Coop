using Coop.Application.Common.Interfaces;
using Coop.Application.CMS.Dtos;
using Coop.Domain.CMS;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Themes.Commands.RemoveTheme;

public class RemoveThemeHandler : IRequestHandler<RemoveThemeRequest, RemoveThemeResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveThemeHandler(ICoopDbContext context) { _context = context; }

    public async Task<RemoveThemeResponse> Handle(RemoveThemeRequest request, CancellationToken cancellationToken)
    {
        var theme = await _context.Themes.SingleAsync(t => t.ThemeId == request.ThemeId, cancellationToken);
        theme.Delete();
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveThemeResponse { Theme = ThemeDto.FromTheme(theme) };
    }
}
