using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features
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

        public class Request : IRequest<Response>
        {
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

            public Handler(ICoopDbContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                if (!_httpContextAccessor.HttpContext.User.Identity.IsAuthenticated)
                {
                    return new();
                }

                var userId = new Guid(_httpContextAccessor.HttpContext.User.FindFirst(Constants.ClaimTypes.UserId).Value);


                return new ()
                {

                };
            }
        }
    }
}
