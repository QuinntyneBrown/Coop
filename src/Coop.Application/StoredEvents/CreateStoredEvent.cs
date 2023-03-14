using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features;

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.StoredEvent).NotNull();
        RuleFor(request => request.StoredEvent).SetValidator(new StoredEventValidator());
    }
}
public class CreateStoredEventRequest : IRequest<CreateStoredEventResponse>
{
    public StoredEventDto StoredEvent { get; set; }
}
public class CreateStoredEventResponse : ResponseBase
{
    public StoredEventDto StoredEvent { get; set; }
}
public class CreateStoredEventHandler : IRequestHandler<CreateStoredEventRequest, CreateStoredEventResponse>
{
    private readonly ICoopDbContext _context;
    public CreateStoredEventHandler(ICoopDbContext context)
        => _context = context;
    public async Task<CreateStoredEventResponse> Handle(CreateStoredEventRequest request, CancellationToken cancellationToken)
    {
        var storedEvent = new StoredEvent();
        _context.StoredEvents.Add(storedEvent);
        await _context.SaveChangesAsync(cancellationToken);
        return new CreateStoredEventResponse()
        {
            StoredEvent = storedEvent.ToDto()
        };
    }
}
