using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Models;
using Coop.Api.Core;
using Coop.Api.Interfaces;

namespace Coop.Api.Features
{
    public class CreateProfileCssCustomProperty
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.ProfileCssCustomProperty).NotNull();
                RuleFor(request => request.ProfileCssCustomProperty).SetValidator(new ProfileCssCustomPropertyValidator());
            }
        }

        public class Request : IRequest<Response>
        {
            public ProfileCssCustomPropertyDto ProfileCssCustomProperty { get; set; }
        }

        public class Response : ResponseBase
        {
            public ProfileCssCustomPropertyDto ProfileCssCustomProperty { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var profileCssCustomProperty = new ProfileCssCustomProperty(request.ProfileCssCustomProperty.CssCustomProperyId);

                _context.ProfileCssCustomProperties.Add(profileCssCustomProperty);

                await _context.SaveChangesAsync(cancellationToken);

                return new()
                {
                    ProfileCssCustomProperty = profileCssCustomProperty.ToDto()
                };
            }

        }
    }
}
