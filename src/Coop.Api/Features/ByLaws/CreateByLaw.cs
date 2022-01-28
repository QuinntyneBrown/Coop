using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Core.Models;
using Coop.Core;
using Coop.Core.Interfaces;
using System;
using Microsoft.AspNetCore.Http;

namespace Coop.Api.Features
{
    public class CreateByLaw
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {

            }

        }

        public class Request : IRequest<Response>
        {
            public Guid DigitalAssetId { get; set; }
            public string Name { get; set; }
        }

        public class Response : ResponseBase
        {
            public ByLawDto ByLaw { get; set; }
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
                var userId = new Guid(_httpContextAccessor.HttpContext.User.FindFirst(Constants.ClaimTypes.UserId).Value);

                var user = await _context.Users.FindAsync(userId);

                var @event = new Core.DomainEvents.CreateDocument(Guid.NewGuid(), request.Name, request.DigitalAssetId, user.CurrentProfileId);

                var byLaw = new ByLaw(@event);

                _context.ByLaws.Add(byLaw);

                await _context.SaveChangesAsync(cancellationToken);

                return new()
                {
                    ByLaw = byLaw.ToDto()
                };
            }
        }
    }
}
