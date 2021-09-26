using Coop.Core;
using Coop.Core.Interfaces;
using Coop.Core.Models;
using Coop.Core.DomainEvents;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;

namespace Coop.Api.Features
{
    public class Authenticate
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Username).NotNull();
                RuleFor(x => x.Password).NotNull();
            }
        }

        public record Request(string Username, string Password) : IRequest<Response>;

        public record Response(string AccessToken, Guid UserId);

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
            private readonly IPasswordHasher _passwordHasher;
            private readonly ITokenBuilder _tokenBuilder;
            private readonly IOrchestrationHandler _orchestrationHandler;

            public Handler(ICoopDbContext context, IPasswordHasher passwordHasher, ITokenBuilder tokenBuilder, IOrchestrationHandler orchestrationHandler)
            {
                _context = context;
                _passwordHasher = passwordHasher;
                _tokenBuilder = tokenBuilder;
                _orchestrationHandler = orchestrationHandler;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                    .Include(x => x.Roles)
                    .ThenInclude(x => x.Privileges)
                    .SingleOrDefaultAsync(x => x.Username == request.Username);

                if (user == null)
                    throw new Exception();

                if (!ValidateUser(user, _passwordHasher.HashPassword(user.Salt, request.Password)))
                    throw new Exception();

                return await _orchestrationHandler.Handle<Response>(new BuildToken(user.Username), (tcs) => async message =>
                 {
                     switch(message)
                     {
                         case BuiltToken builtToken:
                             await _orchestrationHandler.Publish(new AuthenticatedUser(user.Username));
                             tcs.SetResult(new Response(builtToken.AccessToken, builtToken.UserId));                             
                             break;
                     }
                 });
            }

            public bool ValidateUser(User user, string transformedPassword)
            {
                if (user == null || transformedPassword == null)
                    return false;

                return user.Password == transformedPassword;
            }
        }
    }
}
