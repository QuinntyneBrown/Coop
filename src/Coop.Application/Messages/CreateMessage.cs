// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
        RuleFor(request => request.Message).NotNull();
        RuleFor(request => request.Message).SetValidator(new MessageValidator());
    }
}
public class CreateMessageRequest : IRequest<CreateMessageResponse>
{
    public MessageDto Message { get; set; }
}
public class CreateMessageResponse : ResponseBase
{
    public MessageDto Message { get; set; }
}
public class CreateMessageHandler : IRequestHandler<CreateMessageRequest, CreateMessageResponse>
{
    private readonly ICoopDbContext _context;
    public CreateMessageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<CreateMessageResponse> Handle(CreateMessageRequest request, CancellationToken cancellationToken)
    {
        var message = new Message(request.Message.ConversationId, request.Message.ToProfileId, request.Message.FromProfileId, request.Message.Body);
        _context.Messages.Add(message);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            Message = message.ToDto()
        };
    }
}

