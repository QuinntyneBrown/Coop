using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Models;
using Coop.Api.Core;
using Coop.Api.Interfaces;

namespace Coop.Api.Features
{
    public class CreateCssCustomProperty
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.CssCustomProperty).NotNull();
                RuleFor(request => request.CssCustomProperty).SetValidator(new CssCustomPropertyValidator());
            }

        }

        public class Request : IRequest<Response>
        {
            public CssCustomPropertyDto CssCustomProperty { get; set; }
        }

        public class Response : ResponseBase
        {
            public CssCustomPropertyDto CssCustomProperty { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var cssCustomProperty = new CssCustomProperty(
                    request.CssCustomProperty.Name,
                    request.CssCustomProperty.Value
                    );

                _context.CssCustomProperties.Add(cssCustomProperty);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    CssCustomProperty = cssCustomProperty.ToDto()
                };
            }

        }
    }
}
