using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Core.Models;
using Coop.Core;
using Coop.Core.Interfaces;

namespace Coop.Api.Features
{
    public class CreateInvitationToken
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.InvitationToken).NotNull();
                RuleFor(request => request.InvitationToken).SetValidator(new InvitationTokenValidator());
            }

        }

        public class Request : IRequest<Response>
        {
            public InvitationTokenDto InvitationToken { get; set; }
        }

        public class Response : ResponseBase
        {
            public InvitationTokenDto InvitationToken { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var invitationToken = new InvitationToken(request.InvitationToken.Value, request.InvitationToken.Expiry);

                _context.InvitationTokens.Add(invitationToken);

                await _context.SaveChangesAsync(cancellationToken);

                return new()
                {
                    InvitationToken = invitationToken.ToDto()
                };
            }

        }
    }
}
