using Coop.Core;
using Coop.Core.Interfaces;
using Coop.Core.Models;
using Coop.Core.DomainEvents;
using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using static Coop.Core.Constants;

namespace Coop.Api.Features
{
    public class CreateUser
    {

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.User).NotNull();
                RuleFor(request => request.User).SetValidator(new UserValidator());
            }
        }

        [AuthorizeResourceOperation(nameof(Operations.Create), nameof(Aggregates.User))]
        public class Request : IRequest<Response>
        {
            public UserDto User { get; set; }
        }

        public class Response : ResponseBase
        {
            public UserDto User { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
            private readonly IPasswordHasher _passwordHasher;
            private readonly IOrchestrationHandler _messageHandlerContext;

            public Handler(ICoopDbContext context, IPasswordHasher passwordHasher, IOrchestrationHandler messageHandlerContext)
            {
                _context = context;
                _passwordHasher = passwordHasher;
                _messageHandlerContext = messageHandlerContext;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var user = new User(request.User.Username, request.User.Password, _passwordHasher);

                _context.Users.Add(user);

                await _context.SaveChangesAsync(cancellationToken);

                return new()
                {
                    User = user.ToDto()
                };
            }
        }
    }
}
