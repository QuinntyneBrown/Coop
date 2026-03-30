using Coop.Domain.Common;

namespace Coop.Domain.Messaging;

public class Conversation : AggregateRoot
{
    public Guid ConversationId { get; set; } = Guid.NewGuid();
    public List<Guid> ParticipantProfileIds { get; set; } = new();
    public List<Message> Messages { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastMessageAt { get; set; }

    public void AddMessage(Message message)
    {
        message.ConversationId = ConversationId;
        Messages.Add(message);
        LastMessageAt = message.CreatedAt;
    }

    public bool HasParticipant(Guid profileId)
    {
        return ParticipantProfileIds.Contains(profileId);
    }

    protected override void When(dynamic @event) { }

    public override void EnsureValidState()
    {
        if (ConversationId == Guid.Empty)
            throw new InvalidOperationException("ConversationId is required.");
    }
}
