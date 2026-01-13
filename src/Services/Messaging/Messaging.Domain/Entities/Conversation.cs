// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Messaging.Domain.Entities;

public class Conversation
{
    public Guid ConversationId { get; private set; } = Guid.NewGuid();
    public List<Guid> ParticipantProfileIds { get; private set; } = new();
    public List<Message> Messages { get; private set; } = new();
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? LastMessageAt { get; private set; }

    private Conversation() { }

    public Conversation(Guid profileId1, Guid profileId2)
    {
        ParticipantProfileIds = new List<Guid> { profileId1, profileId2 };
    }

    public Message AddMessage(Guid fromProfileId, Guid toProfileId, string body)
    {
        if (!ParticipantProfileIds.Contains(fromProfileId) || !ParticipantProfileIds.Contains(toProfileId))
        {
            throw new InvalidOperationException("Sender and receiver must be participants in this conversation");
        }

        var message = new Message(ConversationId, fromProfileId, toProfileId, body);
        Messages.Add(message);
        LastMessageAt = DateTime.UtcNow;
        return message;
    }

    public bool HasParticipant(Guid profileId)
    {
        return ParticipantProfileIds.Contains(profileId);
    }
}
