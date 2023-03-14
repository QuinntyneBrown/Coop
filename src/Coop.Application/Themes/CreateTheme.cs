using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features;

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.Theme).NotNull();
        RuleFor(request => request.Theme).SetValidator(new ThemeValidator());
    }
}
public class CreateThemeRequest : IRequest<CreateThemeResponse>
{
    public ThemeDto Theme { get; set; }
}
public class CreateThemeResponse : ResponseBase
{
    public ThemeDto Theme { get; set; }
}
public class CreateThemeHandler : IRequestHandler<CreateThemeRequest, CreateThemeResponse>
{
    private readonly ICoopDbContext _context;
    public CreateThemeHandler(ICoopDbContext context)
        => _context = context;
    public async Task<CreateThemeResponse> Handle(CreateThemeRequest request, CancellationToken cancellationToken)
    {
        var theme = new Theme(request.Theme.ProfileId, request.Theme.CssCustomProperties);
        _context.Themes.Add(theme);
        await _context.SaveChangesAsync(cancellationToken);
        return new CreateThemeResponse()
        {
            Theme = theme.ToDto()
        };
    }
}
