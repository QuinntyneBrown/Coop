using Coop.Core;
using Coop.Core.Interfaces;
using Coop.Core.Models;
using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class CreateMaintenanceRequest
    {
        public class Validator: AbstractValidator<Request>
        {
            public Validator()
            {

            }
        
        }

        public class Request: Coop.Core.DomainEvents.CreateMaintenanceRequest, IRequest<Response> { }

        public class Response: ResponseBase
        {
            public MaintenanceRequestDto MaintenanceRequest { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var maintenanceRequest = new MaintenanceRequest(request);
                
                _context.MaintenanceRequests.Add(maintenanceRequest);
                
                await _context.SaveChangesAsync(cancellationToken);
                
                return new Response()
                {
                    MaintenanceRequest = maintenanceRequest.ToDto()
                };
            }
            
        }
    }
}
