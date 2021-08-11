using Coop.Api.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features.Users
{
    public class ChangePassword
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.OldPassword).NotEmpty();
                RuleFor(x => x.NewPassword)
                    .NotEmpty()
                    .Must(x => x.Length >= 6);
                RuleFor(x => x.ConfirmationPassword)
                    .NotEmpty()
                    .Equal(x => x.NewPassword);
            }
        }

        public class Request : IRequest<Response> {
            public string OldPassword { get; set; }
            public string NewPassword { get; set; }
            public string ConfirmationPassword { get; set; }
        }

        public class Response
        {

        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(ICoopDbContext context, IHttpContextAccessor httpContextAccessor) {            
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken) {

                return new Response()
                {

                };
            }
        }
    }
}
