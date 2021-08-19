using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Api.Models;
using Coop.Api.Core;
using Coop.Api.Interfaces;

namespace Coop.Api.Features
{
    public class RemoveProfileCssCustomProperty
    {
        public class Request : IRequest<Response>
        {
            public Guid ProfileCssCustomPropertyId { get; set; }
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
                var profileCssCustomProperty = await _context.ProfileCssCustomProperties.SingleAsync(x => x.ProfileCssCustomPropertyId == request.ProfileCssCustomPropertyId);

                _context.ProfileCssCustomProperties.Remove(profileCssCustomProperty);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    ProfileCssCustomProperty = profileCssCustomProperty.ToDto()
                };
            }

        }
    }
}
