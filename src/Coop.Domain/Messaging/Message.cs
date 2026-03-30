namespace Coop.Domain.Messaging;

public class Message
{
    public Guid MessageId { get; set; } = Guid.NewGuid();
    public Guid ConversationId { get; set; }
    public Guid FromProfileId { get; set; }
    public Guid? ToProfileId { get; set; }
    public string Body { get; set; } = string.Empty;
    public bool Read { get; set; }
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public bool IsDeleted { get; set; }

    public void MarkAsRead()
    {
        Read = true;
    }

    public void Delete()
    {
        IsDeleted = true;
    }
}
