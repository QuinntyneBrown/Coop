// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.SharedKernel.Events.Messaging;
using Coop.SharedKernel.Messaging;
using Messaging.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Messaging.Api.Features.Messages;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly MessagingDbContext _context;
    private readonly IMessageBus _messageBus;

    public MessagesController(MessagingDbContext context, IMessageBus messageBus)
    {
        _context = context;
        _messageBus = messageBus;
    }

    [HttpGet("{messageId}")]
    public async Task<ActionResult<MessageDto>> GetById(Guid messageId)
    {
        var message = await _context.Messages.FindAsync(messageId);

        if (message == null)
            return NotFound();

        return Ok(new MessageDto(
            message.MessageId,
            message.ConversationId,
            message.FromProfileId,
            message.ToProfileId,
            message.Body,
            message.IsRead,
            message.ReadAt,
            message.CreatedAt
        ));
    }

    [HttpGet("by-conversation/{conversationId}")]
    public async Task<ActionResult<List<MessageDto>>> GetByConversation(Guid conversationId, [FromQuery] int skip = 0, [FromQuery] int take = 50)
    {
        var messages = await _context.Messages
            .Where(m => m.ConversationId == conversationId)
            .OrderByDescending(m => m.CreatedAt)
            .Skip(skip)
            .Take(take)
            .Select(m => new MessageDto(
                m.MessageId,
                m.ConversationId,
                m.FromProfileId,
                m.ToProfileId,
                m.Body,
                m.IsRead,
                m.ReadAt,
                m.CreatedAt
            ))
            .ToListAsync();

        return Ok(messages);
    }

    [HttpGet("unread/{profileId}")]
    public async Task<ActionResult<List<MessageDto>>> GetUnread(Guid profileId)
    {
        var messages = await _context.Messages
            .Where(m => m.ToProfileId == profileId && !m.IsRead)
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => new MessageDto(
                m.MessageId,
                m.ConversationId,
                m.FromProfileId,
                m.ToProfileId,
                m.Body,
                m.IsRead,
                m.ReadAt,
                m.CreatedAt
            ))
            .ToListAsync();

        return Ok(messages);
    }

    [HttpGet("unread-count/{profileId}")]
    public async Task<ActionResult<int>> GetUnreadCount(Guid profileId)
    {
        var count = await _context.Messages
            .CountAsync(m => m.ToProfileId == profileId && !m.IsRead);

        return Ok(count);
    }

    [HttpPost("{messageId}/read")]
    public async Task<IActionResult> MarkAsRead(Guid messageId)
    {
        var message = await _context.Messages.FindAsync(messageId);

        if (message == null)
            return NotFound();

        message.MarkAsRead();
        await _context.SaveChangesAsync();

        await _messageBus.PublishAsync(new MessageReadEvent
        {
            MessageId = messageId,
            ConversationId = message.ConversationId,
            ReadByProfileId = message.ToProfileId
        });

        return Ok();
    }

    [HttpPost("mark-conversation-read/{conversationId}/{profileId}")]
    public async Task<IActionResult> MarkConversationAsRead(Guid conversationId, Guid profileId)
    {
        var messages = await _context.Messages
            .Where(m => m.ConversationId == conversationId && m.ToProfileId == profileId && !m.IsRead)
            .ToListAsync();

        foreach (var message in messages)
        {
            message.MarkAsRead();
        }

        await _context.SaveChangesAsync();

        return Ok(new { MarkedAsRead = messages.Count });
    }
}

public record MessageDto(
    Guid MessageId,
    Guid ConversationId,
    Guid FromProfileId,
    Guid ToProfileId,
    string Body,
    bool IsRead,
    DateTime? ReadAt,
    DateTime CreatedAt
);
