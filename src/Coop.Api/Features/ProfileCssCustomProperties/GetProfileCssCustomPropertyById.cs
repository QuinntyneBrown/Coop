using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class GetProfileCssCustomPropertyById
    {
        public class Request: IRequest<Response>
        {
            public Guid ProfileCssCustomPropertyId { get; set; }
        }

        public class Response: ResponseBase
        {
            public ProfileCssCustomPropertyDto ProfileCssCustomProperty { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                return new () {
                    ProfileCssCustomProperty = (await _context.ProfileCssCustomProperties.SingleOrDefaultAsync(x => x.ProfileCssCustomPropertyId == request.ProfileCssCustomPropertyId)).ToDto()
                };
            }
            
        }
    }
}
