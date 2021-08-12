using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Models;
using Coop.Api.Core;
using Coop.Api.Interfaces;

namespace Coop.Api.Features
{
    public class CreateMember
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.Member).NotNull();
                RuleFor(request => request.Member).SetValidator(new MemberValidator());
            }
        }

        [AuthorizeResourceOperation(nameof(AccessRight.Create), nameof(Constants.Aggregates.Member))]
        public class Request : IRequest<Response>
        {
            public MemberDto Member { get; set; }
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
                var member = new Member(request.Member.UserId, request.Member.Firstname, request.Member.Lastname);

                _context.Members.Add(member);

                await _context.SaveChangesAsync(cancellationToken);

                return new()
                {
                    Member = member.ToDto()
                };
            }

        }
    }
}
