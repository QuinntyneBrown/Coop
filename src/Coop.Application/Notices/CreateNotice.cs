using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Domain.Entities;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features
{
    public class CreateNotice
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
            public NoticeDto Notice { get; set; }
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

                var @event = new Domain.DomainEvents.CreateDocument(Guid.NewGuid(), request.Name, request.DigitalAssetId, user.CurrentProfileId);

                var notice = new Notice(@event);

                _context.Notices.Add(notice);

                await _context.SaveChangesAsync(cancellationToken);

                return new()
                {
                    Notice = notice.ToDto()
                };
            }
        }
    }
}
