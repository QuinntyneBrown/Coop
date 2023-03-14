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
        RuleFor(request => request.Conversation).NotNull();
        RuleFor(request => request.Conversation).SetValidator(new ConversationValidator());
    }
}
public class UpdateConversationRequest : IRequest<UpdateConversationResponse>
{
    public ConversationDto Conversation { get; set; }
}
public class UpdateConversationResponse : ResponseBase
{
    public ConversationDto Conversation { get; set; }
}
public class UpdateConversationHandler : IRequestHandler<UpdateConversationRequest, UpdateConversationResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateConversationHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdateConversationResponse> Handle(UpdateConversationRequest request, CancellationToken cancellationToken)
    {
        var conversation = await _context.Conversations.SingleAsync(x => x.ConversationId == request.Conversation.ConversationId);
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateConversationResponse()
        {
            Conversation = conversation.ToDto()
        };
    }
}
