using Coop.Core;
using Coop.Core.Interfaces;
using Coop.Core.Models;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class CreateReport
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {

            }

        }

        public class Request : IRequest<Response>
        {
            public string Name { get; set; }
            public Guid DigitalAssetId { get; set; }
        }

        public class Response : ResponseBase
        {
            public ReportDto Report { get; set; }
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

                var report = new Report(@event);

                _context.Reports.Add(report);

                await _context.SaveChangesAsync(cancellationToken);

                return new()
                {
                    Report = report.ToDto()
                };
            }
        }
    }
}
