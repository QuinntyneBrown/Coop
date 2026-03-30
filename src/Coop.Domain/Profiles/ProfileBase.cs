namespace Coop.Domain.Profiles;

public abstract class ProfileBase
{
    public Guid ProfileBaseId { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public Guid? AvatarDigitalAssetId { get; set; }
    public ProfileType ProfileType { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public void SetAvatar(Guid digitalAssetId)
    {
        AvatarDigitalAssetId = digitalAssetId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateBase(string firstName, string lastName, string? phoneNumber)
    {
        FirstName = firstName;
        LastName = lastName;
        PhoneNumber = phoneNumber;
        UpdatedAt = DateTime.UtcNow;
    }
}
