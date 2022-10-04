using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Coop.Domain.Entities;

namespace Coop.Application.Features
{
    public class UpdateTheme
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.Theme).NotNull();
                RuleFor(request => request.Theme).SetValidator(new ThemeValidator());
            }

        }

        public class Request : IRequest<Response>
        {
            public ThemeDto Theme { get; set; }
        }

        public class Response : ResponseBase
        {
            public ThemeDto Theme { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var theme = await _context.Themes.SingleAsync(x => x.ThemeId == request.Theme.ThemeId);

                theme.SetCssCustomProperties(request.Theme.CssCustomProperties);

                await _context.SaveChangesAsync(cancellationToken);

                return new()
                {
                    Theme = theme.ToDto()
                };
            }

        }
    }
}
