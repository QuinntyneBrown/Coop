using Coop.Application.Messaging.Commands.CreateConversation;
using Coop.Application.Messaging.Commands.DeleteConversation;
using Coop.Application.Messaging.Commands.SendMessage;
using Coop.Application.Messaging.Queries.GetConversationBetween;
using Coop.Application.Messaging.Queries.GetConversationById;
using Coop.Application.Messaging.Queries.GetConversationsByProfile;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.Messaging;

[ApiController]
[Route("api/conversations")]
[Authorize]
public class ConversationsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ConversationsController(IMediator mediator) => _mediator = mediator;

    [HttpGet("by-profile/{profileId}")]
    public async Task<ActionResult<GetConversationsByProfileResponse>> GetByProfile([FromRoute] Guid profileId)
        => Ok(await _mediator.Send(new GetConversationsByProfileRequest { ProfileId = profileId }));

    [HttpGet("{conversationId}")]
    public async Task<ActionResult<GetConversationByIdResponse>> GetById([FromRoute] Guid conversationId)
        => Ok(await _mediator.Send(new GetConversationByIdRequest { ConversationId = conversationId }));

    [HttpGet("between/{id1}/{id2}")]
    public async Task<ActionResult<GetConversationBetweenResponse>> GetBetween([FromRoute] Guid id1, [FromRoute] Guid id2)
        => Ok(await _mediator.Send(new GetConversationBetweenRequest { ProfileIdA = id1, ProfileIdB = id2 }));

    [HttpPost]
    public async Task<ActionResult<CreateConversationResponse>> Create([FromBody] CreateConversationRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPost("{id}/messages")]
    public async Task<ActionResult<SendMessageResponse>> SendMessage([FromRoute] Guid id, [FromBody] SendMessageRequest request)
    {
        request.ConversationId = id;
        return Ok(await _mediator.Send(request));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<DeleteConversationResponse>> Delete([FromRoute] Guid id)
        => Ok(await _mediator.Send(new DeleteConversationRequest { ConversationId = id }));
}
