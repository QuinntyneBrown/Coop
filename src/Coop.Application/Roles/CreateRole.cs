using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features
{
    public class CreateRole
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.Role).NotNull();
                RuleFor(request => request.Role).SetValidator(new RoleValidator());
            }

        }

        public class Request : IRequest<Response>
        {
            public RoleDto Role { get; set; }
        }

        public class Response : ResponseBase
        {
            public RoleDto Role { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var role = new Role(request.Role.Name);

                _context.Roles.Add(role);

                await _context.SaveChangesAsync(cancellationToken);

                return new()
                {
                    Role = role.ToDto()
                };
            }

        }
    }
}
