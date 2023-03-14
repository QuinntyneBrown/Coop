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

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.Message).NotNull();
        RuleFor(request => request.Message).SetValidator(new MessageValidator());
    }
}
public class UpdateMessageRequest : IRequest<UpdateMessageResponse>
{
    public MessageDto Message { get; set; }
}
public class UpdateMessageResponse : ResponseBase
{
    public MessageDto Message { get; set; }
}
public class UpdateMessageHandler : IRequestHandler<UpdateMessageRequest, UpdateMessageResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateMessageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdateMessageResponse> Handle(UpdateMessageRequest request, CancellationToken cancellationToken)
    {
        var message = await _context.Messages.SingleAsync(x => x.MessageId == request.Message.MessageId);
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateMessageResponse()
        {
            Message = message.ToDto()
        };
    }
}

