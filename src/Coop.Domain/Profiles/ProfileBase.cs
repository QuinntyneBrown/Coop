using Coop.Domain.Profiles.ValueObjects;

namespace Coop.Domain.Profiles;

public abstract class ProfileBase
{
    public Guid ProfileId { get; set; } = Guid.NewGuid();
    public Guid? UserId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public Guid? AvatarDigitalAssetId { get; set; }
    public Address? Address { get; set; }
    public ProfileType Type { get; set; }
    public bool IsDeleted { get; set; }

    public string Fullname => $"{Firstname} {Lastname}";

    public void SetAvatar(Guid digitalAssetId)
    {
        AvatarDigitalAssetId = digitalAssetId;
    }

    public void Delete()
    {
        IsDeleted = true;
    }
}
