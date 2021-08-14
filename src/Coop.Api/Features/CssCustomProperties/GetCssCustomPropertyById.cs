using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class GetCssCustomPropertyById
    {
        public class Request: IRequest<Response>
        {
            public Guid CssCustomPropertyId { get; set; }
        }

        public class Response: ResponseBase
        {
            public CssCustomPropertyDto CssCustomProperty { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                return new () {
                    CssCustomProperty = (await _context.CssCustomProperties.SingleOrDefaultAsync(x => x.CssCustomPropertyId == request.CssCustomPropertyId)).ToDto()
                };
            }
            
        }
    }
}
