using Coop.Api.Core;
using Coop.Api.Interfaces;
using Coop.Api.Models;
using FluentValidation;
using MediatR;
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

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var maintenanceRequest = new MaintenanceRequest(
                    request.MaintenanceRequest.Title,
                    request.MaintenanceRequest.Description,
                    request.MaintenanceRequest.CreatedById
                    );

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
