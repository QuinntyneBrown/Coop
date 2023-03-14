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

public class CreateConversationValidator : AbstractValidator<CreateConversationRequest>
{
    public CreateConversationValidator()
    {
        RuleFor(request => request.Conversation).NotNull();
        RuleFor(request => request.Conversation).SetValidator(new ConversationValidator());
    }
}
public class CreateConversationRequest : IRequest<CreateConversationResponse>
{
    public ConversationDto Conversation { get; set; }
}
public class CreateConversationResponse : ResponseBase
{
    public ConversationDto Conversation { get; set; }
}
public class CreateConversationHandler : IRequestHandler<CreateConversationRequest, CreateConversationResponse>
{
    private readonly ICoopDbContext _context;
    public CreateConversationHandler(ICoopDbContext context)
        => _context = context;
    public async Task<CreateConversationResponse> Handle(CreateConversationRequest request, CancellationToken cancellationToken)
    {
        var conversation = new Conversation();
        _context.Conversations.Add(conversation);
        await _context.SaveChangesAsync(cancellationToken);
        return new CreateConversationResponse()
        {
            Conversation = conversation.ToDto()
        };
    }
}

