namespace Coop.Domain.Messaging;

public class Message
{
    public Guid MessageId { get; set; } = Guid.NewGuid();
    public Guid ConversationId { get; set; }
    public Guid FromProfileId { get; set; }
    public Guid ToProfileId { get; set; }
    public string Body { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public void MarkAsRead()
    {
        IsRead = true;
        ReadAt = DateTime.UtcNow;
    }
}
