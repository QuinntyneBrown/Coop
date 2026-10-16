using Coop.Domain.Profiles.ValueObjects;
using Coop.Domain.Tenancy;

namespace Coop.Domain.Profiles;

public abstract class ProfileBase : ITenantOwned
{
    public Guid ProfileId { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public Guid? UserId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public Guid? AvatarDigitalAssetId { get; set; }
    public Address? Address { get; set; }
    public ProfileType Type { get; set; }
    public bool IsDeleted { get; set; }
    public bool NoticeByEmail { get; set; }
    public bool NoticeByText { get; set; }

    public string Fullname => $"{Firstname} {Lastname}";

    public void SetAvatar(Guid digitalAssetId)
    {
        AvatarDigitalAssetId = digitalAssetId;
    }

    public void ClearAvatar()
    {
        AvatarDigitalAssetId = null;
    }

    public void Delete()
    {
        IsDeleted = true;
    }
}
