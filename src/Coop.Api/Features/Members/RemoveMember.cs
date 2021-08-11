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
    public class RemoveMember
    {
        public class Request: IRequest<Response>
        {
            public Guid MemberId { get; set; }
        }

        public class Response: ResponseBase
        {
            public MemberDto Member { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var member = await _context.Members.SingleAsync(x => x.MemberId == request.MemberId);
                
                _context.Members.Remove(member);
                
                await _context.SaveChangesAsync(cancellationToken);
                
                return new Response()
                {
                    Member = member.ToDto()
                };
            }
            
        }
    }
}
