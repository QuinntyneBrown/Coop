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
