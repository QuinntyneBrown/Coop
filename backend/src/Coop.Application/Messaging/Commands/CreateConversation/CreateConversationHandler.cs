using System.Security.Claims;
using Coop.Application.Common;
using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using Coop.Domain.Messaging;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Commands.CreateConversation;

public class CreateConversationHandler : IRequestHandler<CreateConversationRequest, CreateConversationResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;
    public CreateConversationHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user) { _context = context; _authorization = authorization; _user = user; }

    public async Task<CreateConversationResponse> Handle(CreateConversationRequest request, CancellationToken cancellationToken)
    {
        // A member always takes part in a conversation they start.
        var profileIds = request.ProfileIds.Distinct().ToList();
        if (!await ConversationAccess.IsOfficeAsync(_authorization, _user))
        {
            var own = await CallerAccess.OwnProfileIdsAsync(_context, _user, cancellationToken);
            if (!profileIds.Any(own.Contains) && await CallerAccess.CurrentProfileIdAsync(_context, _user, cancellationToken) is Guid current)
                profileIds.Insert(0, current);
        }
        var conversation = new Conversation();
        foreach (var pid in profileIds)
            conversation.Profiles.Add(new ConversationProfile { ConversationId = conversation.ConversationId, ProfileId = pid });
        _context.Conversations.Add(conversation);
        await _context.SaveChangesAsync(cancellationToken);
        return new CreateConversationResponse { Conversation = ConversationDto.FromConversation(conversation) };
    }
}
