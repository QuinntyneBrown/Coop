// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.SharedKernel.Events.Messaging;
using Coop.SharedKernel.Messaging;
using Messaging.Domain.Entities;
using Messaging.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Messaging.Api.Features.Conversations;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ConversationsController : ControllerBase
{
    private readonly MessagingDbContext _context;
    private readonly IMessageBus _messageBus;

    public ConversationsController(MessagingDbContext context, IMessageBus messageBus)
    {
        _context = context;
        _messageBus = messageBus;
    }

    [HttpGet("by-profile/{profileId}")]
    public async Task<ActionResult<List<ConversationDto>>> GetByProfile(Guid profileId)
    {
        var conversations = await _context.Conversations
            .Include(c => c.Messages.OrderByDescending(m => m.CreatedAt).Take(1))
            .Where(c => c.ParticipantProfileIds.Contains(profileId))
            .OrderByDescending(c => c.LastMessageAt)
            .Select(c => new ConversationDto(
                c.ConversationId,
                c.ParticipantProfileIds,
                c.Messages.Select(m => new MessageDto(
                    m.MessageId,
                    m.ConversationId,
                    m.FromProfileId,
                    m.ToProfileId,
                    m.Body,
                    m.IsRead,
                    m.ReadAt,
                    m.CreatedAt
                )).ToList(),
                c.CreatedAt,
                c.LastMessageAt
            ))
            .ToListAsync();

        return Ok(conversations);
    }

    [HttpGet("{conversationId}")]
    public async Task<ActionResult<ConversationDto>> GetById(Guid conversationId)
    {
        var conversation = await _context.Conversations
            .Include(c => c.Messages.OrderByDescending(m => m.CreatedAt))
            .SingleOrDefaultAsync(c => c.ConversationId == conversationId);

        if (conversation == null)
            return NotFound();

        return Ok(new ConversationDto(
            conversation.ConversationId,
            conversation.ParticipantProfileIds,
            conversation.Messages.Select(m => new MessageDto(
                m.MessageId,
                m.ConversationId,
                m.FromProfileId,
                m.ToProfileId,
                m.Body,
                m.IsRead,
                m.ReadAt,
                m.CreatedAt
            )).ToList(),
            conversation.CreatedAt,
            conversation.LastMessageAt
        ));
    }

    [HttpGet("between/{profileId1}/{profileId2}")]
    public async Task<ActionResult<ConversationDto?>> GetBetweenProfiles(Guid profileId1, Guid profileId2)
    {
        var conversation = await _context.Conversations
            .Include(c => c.Messages.OrderByDescending(m => m.CreatedAt))
            .FirstOrDefaultAsync(c =>
                c.ParticipantProfileIds.Contains(profileId1) &&
                c.ParticipantProfileIds.Contains(profileId2));

        if (conversation == null)
            return Ok(null);

        return Ok(new ConversationDto(
            conversation.ConversationId,
            conversation.ParticipantProfileIds,
            conversation.Messages.Select(m => new MessageDto(
                m.MessageId,
                m.ConversationId,
                m.FromProfileId,
                m.ToProfileId,
                m.Body,
                m.IsRead,
                m.ReadAt,
                m.CreatedAt
            )).ToList(),
            conversation.CreatedAt,
            conversation.LastMessageAt
        ));
    }

    [HttpPost]
    public async Task<ActionResult<ConversationDto>> Create([FromBody] CreateConversationRequest request)
    {
        // Check if conversation already exists
        var existing = await _context.Conversations
            .FirstOrDefaultAsync(c =>
                c.ParticipantProfileIds.Contains(request.ProfileId1) &&
                c.ParticipantProfileIds.Contains(request.ProfileId2));

        if (existing != null)
        {
            return BadRequest("Conversation already exists between these profiles");
        }

        var conversation = new Conversation(request.ProfileId1, request.ProfileId2);

        _context.Conversations.Add(conversation);
        await _context.SaveChangesAsync();

        await _messageBus.PublishAsync(new ConversationCreatedEvent
        {
            ConversationId = conversation.ConversationId,
            ParticipantProfileIds = conversation.ParticipantProfileIds
        });

        return CreatedAtAction(nameof(GetById), new { conversationId = conversation.ConversationId },
            new ConversationDto(
                conversation.ConversationId,
                conversation.ParticipantProfileIds,
                new List<MessageDto>(),
                conversation.CreatedAt,
                conversation.LastMessageAt
            ));
    }

    [HttpPost("{conversationId}/messages")]
    public async Task<ActionResult<MessageDto>> SendMessage(Guid conversationId, [FromBody] SendMessageRequest request)
    {
        var conversation = await _context.Conversations
            .Include(c => c.Messages)
            .SingleOrDefaultAsync(c => c.ConversationId == conversationId);

        if (conversation == null)
            return NotFound();

        try
        {
            var message = conversation.AddMessage(request.FromProfileId, request.ToProfileId, request.Body);
            await _context.SaveChangesAsync();

            await _messageBus.PublishAsync(new MessageSentEvent
            {
                MessageId = message.MessageId,
                ConversationId = conversationId,
                FromProfileId = message.FromProfileId,
                ToProfileId = message.ToProfileId,
                Body = message.Body
            });

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
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}

public record ConversationDto(
    Guid ConversationId,
    List<Guid> ParticipantProfileIds,
    List<MessageDto> Messages,
    DateTime CreatedAt,
    DateTime? LastMessageAt
);

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

public record CreateConversationRequest(Guid ProfileId1, Guid ProfileId2);
public record SendMessageRequest(Guid FromProfileId, Guid ToProfileId, string Body);
