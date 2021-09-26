using Coop.Core;
using Coop.Core.Interfaces;
using Coop.Core.Models;
using Coop.Core;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class CreateMaintenanceRequest
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.MaintenanceRequest).NotNull();
                RuleFor(request => request.MaintenanceRequest).SetValidator(new MaintenanceRequestValidator());
            }
        }

        public class Request : IRequest<Response>
        {
            public MaintenanceRequestDto MaintenanceRequest { get; set; }
        }

        public class Response : ResponseBase
        {
            public MaintenanceRequestDto MaintenanceRequest { get; set; }
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

                var maintenanceRequest = new MaintenanceRequest(new Core.DomainEvents.CreateMaintenanceRequest());

                foreach (var digitalAsset in request.MaintenanceRequest.DigitalAssets)
                {
                    maintenanceRequest.DigitalAssets.Add(new(digitalAsset.DigitalAssetId));
                }

                _context.MaintenanceRequests.Add(maintenanceRequest);

                await _context.SaveChangesAsync(cancellationToken);

                return new()
                {
                    MaintenanceRequest = maintenanceRequest.ToDto()
                };
            }

        }
    }
}
