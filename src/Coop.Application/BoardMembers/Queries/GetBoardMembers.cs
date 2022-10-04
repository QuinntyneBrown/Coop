using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.BoardMembers
{
    public class GetBoardMembers
    {
        public class Request : IRequest<Response> { }

        public class Response : ResponseBase
        {
            public List<BoardMemberDto> BoardMembers { get; set; }
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
                    BoardMembers = await _context.BoardMembers.Select(x => x.ToDto()).ToListAsync()
                };
            }

        }
    }
}
