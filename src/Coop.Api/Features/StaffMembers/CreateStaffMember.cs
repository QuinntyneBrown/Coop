using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Models;
using Coop.Api.Core;
using Coop.Api.Interfaces;

namespace Coop.Api.Features
{
    public class CreateStaffMember
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.StaffMember).NotNull();
                RuleFor(request => request.StaffMember).SetValidator(new StaffMemberValidator());
            }

        }

        public class Request : IRequest<Response>
        {
            public StaffMemberDto StaffMember { get; set; }
        }

        public class Response : ResponseBase
        {
            public StaffMemberDto StaffMember { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var staffMember = new StaffMember();

                _context.StaffMembers.Add(staffMember);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    StaffMember = staffMember.ToDto()
                };
            }

        }
    }
}
