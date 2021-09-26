using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Core.Models;
using Coop.Core;
using Coop.Core.Interfaces;

namespace Coop.Api.Features
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
