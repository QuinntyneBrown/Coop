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
    public class RemoveFragment
    {
        public class Request: IRequest<Response>
        {
            public Guid FragmentId { get; set; }
        }

        public class Response: ResponseBase
        {
            public FragmentDto Fragment { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var fragment = await _context.Fragments.SingleAsync(x => x.FragmentId == request.FragmentId);
                
                _context.Fragments.Remove(fragment);
                
                await _context.SaveChangesAsync(cancellationToken);
                
                return new Response()
                {
                    Fragment = fragment.ToDto()
                };
            }
            
        }
    }
}
