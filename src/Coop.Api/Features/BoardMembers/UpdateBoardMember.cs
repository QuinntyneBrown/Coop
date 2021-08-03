using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class UpdateBoardMember
    {
        public class Validator: AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.BoardMember).NotNull();
                RuleFor(request => request.BoardMember).SetValidator(new BoardMemberValidator());
            }
        
        }

        public class Request: IRequest<Response>
        {
            public BoardMemberDto BoardMember { get; set; }
        }

        public class Response: ResponseBase
        {
            public BoardMemberDto BoardMember { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var boardMember = await _context.BoardMembers.SingleAsync(x => x.BoardMemberId == request.BoardMember.BoardMemberId);
                
                await _context.SaveChangesAsync(cancellationToken);
                
                return new Response()
                {
                    BoardMember = boardMember.ToDto()
                };
            }
            
        }
    }
}
