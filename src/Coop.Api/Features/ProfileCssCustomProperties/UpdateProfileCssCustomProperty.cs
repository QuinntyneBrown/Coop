using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class UpdateProfileCssCustomProperty
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
                var profileCssCustomProperty = await _context.ProfileCssCustomProperties.SingleAsync(x => x.ProfileCssCustomPropertyId == request.ProfileCssCustomProperty.ProfileCssCustomPropertyId);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    ProfileCssCustomProperty = profileCssCustomProperty.ToDto()
                };
            }

        }
    }
}