using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features
{
    public class GetMemberById
    {
        public class Request : IRequest<Response>
        {
            public Guid MemberId { get; set; }
        }

        public class Response : ResponseBase
        {
            public MemberDto Member { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                return new()
                {
                    Member = (await _context.Members.SingleOrDefaultAsync(x => x.MemberId == request.MemberId)).ToDto()
                };
            }

        }
    }
}
