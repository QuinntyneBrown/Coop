// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class UpdateStoredEventValidator : AbstractValidator<UpdateStoredEventRequest>
{
    public UpdateStoredEventValidator()
    {
        RuleFor(request => request.StoredEvent).NotNull();
        RuleFor(request => request.StoredEvent).SetValidator(new StoredEventValidator());
    }
}
public class UpdateStoredEventRequest : IRequest<UpdateStoredEventResponse>
{
    public StoredEventDto StoredEvent { get; set; }
}
public class UpdateStoredEventResponse : ResponseBase
{
    public StoredEventDto StoredEvent { get; set; }
}
public class UpdateStoredEventHandler : IRequestHandler<UpdateStoredEventRequest, UpdateStoredEventResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateStoredEventHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdateStoredEventResponse> Handle(UpdateStoredEventRequest request, CancellationToken cancellationToken)
    {
        var storedEvent = await _context.StoredEvents.SingleAsync(x => x.StoredEventId == request.StoredEvent.StoredEventId);
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateStoredEventResponse()
        {
            StoredEvent = storedEvent.ToDto()
        };
    }
}

