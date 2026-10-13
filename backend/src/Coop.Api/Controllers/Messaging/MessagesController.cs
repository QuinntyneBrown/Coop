using Coop.Application.Messaging.Commands.DeleteMessage;
using Coop.Application.Messaging.Commands.MarkConversationRead;
using Coop.Application.Messaging.Commands.MarkMessageAsRead;
using Coop.Application.Messaging.Queries.GetMessageById;
using Coop.Application.Messaging.Queries.GetMessagesByConversation;
using Coop.Application.Messaging.Queries.GetUnreadMessageCount;
using Coop.Application.Messaging.Queries.GetUnreadMessages;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.Messaging;

[ApiController]
[Route("api/messages")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly IMediator _mediator;

    public MessagesController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{messageId}")]
    public async Task<ActionResult<GetMessageByIdResponse>> GetById([FromRoute] Guid messageId)
        => Ok(await _mediator.Send(new GetMessageByIdRequest { MessageId = messageId }));

    [HttpGet("by-conversation/{conversationId}")]
    public async Task<ActionResult<GetMessagesByConversationResponse>> GetByConversation([FromRoute] Guid conversationId)
        => Ok(await _mediator.Send(new GetMessagesByConversationRequest { ConversationId = conversationId }));

    [HttpGet("unread/{profileId}")]
    public async Task<ActionResult<GetUnreadMessagesResponse>> GetUnread([FromRoute] Guid profileId)
        => Ok(await _mediator.Send(new GetUnreadMessagesRequest { ProfileId = profileId }));

    [HttpGet("unread-count/{profileId}")]
    public async Task<ActionResult<GetUnreadMessageCountResponse>> GetUnreadCount([FromRoute] Guid profileId)
        => Ok(await _mediator.Send(new GetUnreadMessageCountRequest { ProfileId = profileId }));

    [HttpPost("{messageId}/read")]
    public async Task<ActionResult<MarkMessageAsReadResponse>> MarkAsRead([FromRoute] Guid messageId)
        => Ok(await _mediator.Send(new MarkMessageAsReadRequest { MessageId = messageId }));

    [HttpPost("mark-conversation-read/{conversationId}/{profileId}")]
    public async Task<ActionResult<MarkConversationReadResponse>> MarkConversationRead([FromRoute] Guid conversationId, [FromRoute] Guid profileId)
        => Ok(await _mediator.Send(new MarkConversationReadRequest { ConversationId = conversationId, ProfileId = profileId }));

    [HttpDelete("{messageId}")]
    public async Task<ActionResult<DeleteMessageResponse>> Delete([FromRoute] Guid messageId)
        => Ok(await _mediator.Send(new DeleteMessageRequest { MessageId = messageId }));
}
