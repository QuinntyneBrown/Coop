using Coop.Core;
using Coop.Core.Dtos;
using Coop.Core.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class UpdateMaintenanceRequest
    {
        public class Validator: AbstractValidator<Request>
        {
            public Validator()
            {

            }
        
        }

        public class Request: IRequest<Response> {
            public Guid MaintenanceRequestId { get; set; }
            public Guid RequestedByProfileId { get; set; }
            public string RequestedByName { get; set; }
            public AddressDto Address { get; set; }
            public string Phone { get; set; }
            public string Description { get; set; }
            public bool UnattendedUnitEntryAllowed { get; set; }

            public Coop.Core.DomainEvents.UpdateMaintenanceRequest ToEvent()
            {
                return new Core.DomainEvents.UpdateMaintenanceRequest
                {
                    RequestedByProfileId = RequestedByProfileId,
                    RequestedByName = RequestedByName,
                    Address = Core.Models.Address.Create(Address.Street, Address.Unit.Value, Address.City, Address.Province, Address.PostalCode).Value,
                    Phone = Phone,
                    Description = Description,
                    UnattendedUnitEntryAllowed = UnattendedUnitEntryAllowed
                };
            }
        }

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
                var maintenanceRequest = await _context.MaintenanceRequests.SingleAsync(x => x.MaintenanceRequestId == request.MaintenanceRequestId);

                maintenanceRequest.Apply(request.ToEvent());
                
                await _context.SaveChangesAsync(cancellationToken);
                
                return new Response()
                {
                    MaintenanceRequest = maintenanceRequest.ToDto()
                };
            }
            
        }
    }
}
