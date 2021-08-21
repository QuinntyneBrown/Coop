using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Models;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.AspNetCore.Http;
using System;

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
            private readonly IHttpContextAccessor _httpContextAccessor; 

            public Handler(ICoopDbContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var userId = new Guid(_httpContextAccessor.HttpContext.User.FindFirst(Constants.ClaimTypes.UserId).Value);

                var user = await _context.Users.FindAsync(userId);

                var profileCssCustomProperty = new ProfileCssCustomProperty(user.CurrentProfileId, request.ProfileCssCustomProperty.Name, request.ProfileCssCustomProperty.Value);

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
