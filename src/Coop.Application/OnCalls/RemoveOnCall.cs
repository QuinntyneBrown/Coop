using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features;

public class RemoveOnCallRequest : IRequest<RemoveOnCallResponse>
{
    public Guid OnCallId { get; set; }
}
public class RemoveOnCallResponse : ResponseBase
{
    public OnCallDto OnCall { get; set; }
}
public class RemoveOnCallHandler : IRequestHandler<RemoveOnCallRequest, RemoveOnCallResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveOnCallHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemoveOnCallResponse> Handle(RemoveOnCallRequest request, CancellationToken cancellationToken)
    {
        var onCall = await _context.OnCalls.SingleAsync(x => x.OnCallId == request.OnCallId);
        _context.OnCalls.Remove(onCall);
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveOnCallResponse()
        {
            OnCall = onCall.ToDto()
        };
    }
}
