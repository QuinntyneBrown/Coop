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
    public class RemoveCssCustomProperty
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
                var cssCustomProperty = await _context.CssCustomProperties.SingleAsync(x => x.CssCustomPropertyId == request.CssCustomPropertyId);
                
                _context.CssCustomProperties.Remove(cssCustomProperty);
                
                await _context.SaveChangesAsync(cancellationToken);
                
                return new Response()
                {
                    CssCustomProperty = cssCustomProperty.ToDto()
                };
            }
            
        }
    }
}
