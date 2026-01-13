// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MessagePack;

namespace Coop.SharedKernel.Events.Messaging;

[MessagePackObject]
public class MessageSentEvent : IntegrationEvent
{
    [Key(4)]
    public Guid MessageId { get; set; }

    [Key(5)]
    public Guid ConversationId { get; set; }

    [Key(6)]
    public Guid FromProfileId { get; set; }

    [Key(7)]
    public Guid ToProfileId { get; set; }

    [Key(8)]
    public string Body { get; set; } = string.Empty;
}

[MessagePackObject]
public class MessageReadEvent : IntegrationEvent
{
    [Key(4)]
    public Guid MessageId { get; set; }

    [Key(5)]
    public Guid ConversationId { get; set; }

    [Key(6)]
    public Guid ReadByProfileId { get; set; }
}

[MessagePackObject]
public class ConversationCreatedEvent : IntegrationEvent
{
    [Key(4)]
    public Guid ConversationId { get; set; }

    [Key(5)]
    public List<Guid> ParticipantProfileIds { get; set; } = new();
}
