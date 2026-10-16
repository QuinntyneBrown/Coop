using Coop.Domain.Tenancy;

namespace Coop.Domain.Messaging;

public class Conversation : ITenantOwned
{
    public Guid ConversationId { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public List<Message> Messages { get; set; } = new();
    public List<ConversationProfile> Profiles { get; set; } = new();
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public bool IsDeleted { get; set; }

    public void Delete()
    {
        IsDeleted = true;
    }
}
