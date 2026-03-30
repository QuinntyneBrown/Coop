using Coop.Domain.Common;

namespace Coop.Domain.Onboarding;

public class InvitationToken : AggregateRoot
{
    public Guid InvitationTokenId { get; set; } = Guid.NewGuid();
    public string Value { get; set; } = string.Empty;
    public InvitationTokenType InvitationTokenType { get; set; }
    public bool IsUsed { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public void MarkAsUsed()
    {
        IsUsed = true;
    }

    public bool IsExpired()
    {
        return DateTime.UtcNow > ExpiresAt;
    }

    public bool IsValid()
    {
        return !IsUsed && !IsExpired();
    }

    protected override void When(dynamic @event) { }

    public override void EnsureValidState()
    {
        if (InvitationTokenId == Guid.Empty)
            throw new InvalidOperationException("InvitationTokenId is required.");

        if (string.IsNullOrWhiteSpace(Value))
            throw new InvalidOperationException("Value is required.");
    }
}
