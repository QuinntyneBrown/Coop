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

public class RemoveMessageRequest : IRequest<RemoveMessageResponse>
{
    public Guid MessageId { get; set; }
}
public class RemoveMessageResponse : ResponseBase
{
    public MessageDto Message { get; set; }
}
public class RemoveMessageHandler : IRequestHandler<RemoveMessageRequest, RemoveMessageResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveMessageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemoveMessageResponse> Handle(RemoveMessageRequest request, CancellationToken cancellationToken)
    {
        var message = await _context.Messages.SingleAsync(x => x.MessageId == request.MessageId);
        _context.Messages.Remove(message);
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveMessageResponse()
        {
            Message = message.ToDto()
        };
    }
}
