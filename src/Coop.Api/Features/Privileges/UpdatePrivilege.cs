using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class UpdatePrivilege
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.Privilege).NotNull();
                RuleFor(request => request.Privilege).SetValidator(new PrivilegeValidator());
            }

        }

        public class Request : IRequest<Response>
        {
            public PrivilegeDto Privilege { get; set; }
        }

        public class Response : ResponseBase
        {
            public PrivilegeDto Privilege { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var privilege = await _context.Privileges.SingleAsync(x => x.PrivilegeId == request.Privilege.PrivilegeId);

                await _context.SaveChangesAsync(cancellationToken);

                return new()
                {
                    Privilege = privilege.ToDto()
                };
            }

        }
    }
}
