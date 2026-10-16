using Coop.Domain.Tenancy;

namespace Coop.Domain.Onboarding;

public class InvitationToken : ITenantOwned
{
    public Guid InvitationTokenId { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public string Value { get; set; } = string.Empty;
    public InvitationTokenType Type { get; set; }
    public DateTime? ExpirationDate { get; set; }
    public bool Redeemed { get; set; }
    public bool IsDeleted { get; set; }

    public bool IsValid()
    {
        if (Redeemed) return false;
        if (ExpirationDate.HasValue && ExpirationDate.Value < DateTime.UtcNow) return false;
        return true;
    }

    public void Redeem()
    {
        Redeemed = true;
    }

    public void Delete()
    {
        IsDeleted = true;
    }
}
