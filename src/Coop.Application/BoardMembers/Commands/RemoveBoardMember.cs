using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.BoardMembers
{
    public class RemoveBoardMember
    {
        public class Request : IRequest<Response>
        {
            public Guid ProfileId { get; set; }
        }

        public class Response : ResponseBase
        {
            public BoardMemberDto BoardMember { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var boardMember = await _context.BoardMembers.SingleAsync(x => x.ProfileId == request.ProfileId);

                _context.BoardMembers.Remove(boardMember);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    BoardMember = boardMember.ToDto()
                };
            }

        }
    }
}
