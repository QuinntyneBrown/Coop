using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Models;
using Coop.Api.Core;
using Coop.Api.Interfaces;

namespace Coop.Api.Features
{
    public class CreateBoardMember
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.BoardMember).NotNull();
                RuleFor(request => request.BoardMember).SetValidator(new BoardMemberValidator());
            }

        }

        public class Request : IRequest<Response>
        {
            public BoardMemberDto BoardMember { get; set; }
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
                var boardMember = new BoardMember(
                    request.BoardMember.UserId,
                    request.BoardMember.BoardTitle,
                    request.BoardMember.Firstname,
                    request.BoardMember.Lastname);

                _context.BoardMembers.Add(boardMember);

                await _context.SaveChangesAsync(cancellationToken);

                return new()
                {
                    BoardMember = boardMember.ToDto()
                };
            }

        }
    }
}
