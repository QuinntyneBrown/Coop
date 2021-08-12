using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Models;
using Coop.Api.Core;
using Coop.Api.Interfaces;

namespace Coop.Api.Features
{
    public class CreateProfile
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.Profile).NotNull();
                RuleFor(request => request.Profile).SetValidator(new ProfileValidator());
            }

        }

        public class Request : IRequest<Response>
        {
            public ProfileDto Profile { get; set; }
        }

        public class Response : ResponseBase
        {
            public ProfileDto Profile { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var profile = new Profile(default, request.Profile.UserId, request.Profile.Firstname, request.Profile.Lastname);

                _context.Profiles.Add(profile);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    Profile = profile.ToDto()
                };
            }

        }
    }
}
