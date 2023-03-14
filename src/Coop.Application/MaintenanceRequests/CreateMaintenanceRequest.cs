using Coop.Domain;
using Coop.Domain.Dtos;
using Coop.Domain.Interfaces;
using Coop.Domain.Entities;
using FluentValidation;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
    }
}
public class CreateMaintenanceRequestRequest : IRequest<CreateMaintenanceRequestResponse>
{
    public Guid RequestedByProfileId { get; set; }
    public string RequestedByName { get; set; }
    public AddressDto Address { get; set; }
    public string Phone { get; set; }
    public string Description { get; set; }
    public bool UnattendedUnitEntryAllowed { get; set; }
    public Coop.Domain.DomainEvents.CreateMaintenanceRequest ToEvent()
    {
        return new Domain.DomainEvents.CreateMaintenanceRequest
        {
            RequestedByProfileId = RequestedByProfileId,
            RequestedByName = RequestedByName,
            Address = Coop.Domain.Entities.Address.Create(Address.Street, Address.Unit.Value, Address.City, Address.Province, Address.PostalCode).Value,
            Phone = Phone,
            Description = Description,
            UnattendedUnitEntryAllowed = UnattendedUnitEntryAllowed
        };
    }
}
public class CreateMaintenanceRequestResponse : ResponseBase
{
    public MaintenanceRequestDto MaintenanceRequest { get; set; }
}
public class CreateMaintenanceRequestHandler : IRequestHandler<CreateMaintenanceRequestRequest, CreateMaintenanceRequestResponse>
{
    private readonly ICoopDbContext _context;
    public CreateMaintenanceRequestHandler(ICoopDbContext context)
        => _context = context;
    public async Task<CreateMaintenanceRequestResponse> Handle(CreateMaintenanceRequestRequest request, CancellationToken cancellationToken)
    {
        var maintenanceRequest = new MaintenanceRequest(request.ToEvent());
        _context.MaintenanceRequests.Add(maintenanceRequest);
        await _context.SaveChangesAsync(cancellationToken);
        return new CreateMaintenanceRequestResponse()
        {
            MaintenanceRequest = maintenanceRequest.ToDto()
        };
    }
}
