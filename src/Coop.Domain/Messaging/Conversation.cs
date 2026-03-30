namespace Coop.Domain.Messaging;

public class Conversation
{
    public Guid ConversationId { get; set; } = Guid.NewGuid();
    public List<Message> Messages { get; set; } = new();
    public List<ConversationProfile> Profiles { get; set; } = new();
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public bool IsDeleted { get; set; }

    public void Delete()
    {
        IsDeleted = true;
    }
}
