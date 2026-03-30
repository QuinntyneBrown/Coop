using Coop.Domain.Profiles;

namespace Coop.Domain.Identity;

public class User
{
    public Guid UserId { get; set; } = Guid.NewGuid();
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public byte[] Salt { get; set; } = Array.Empty<byte>();
    public List<Role> Roles { get; set; } = new();
    public List<ProfileBase> Profiles { get; set; } = new();
    public Guid? CurrentProfileId { get; set; }
    public Guid? DefaultProfileId { get; set; }
    public bool IsDeleted { get; set; }

    public void SetUsername(string username)
    {
        Username = username;
    }

    public void SetPassword(IPasswordHasher passwordHasher, string password)
    {
        Password = passwordHasher.HashPassword(Salt, password);
    }

    public bool ChangePassword(IPasswordHasher passwordHasher, string oldPassword, string newPassword)
    {
        var hashedOldPassword = passwordHasher.HashPassword(Salt, oldPassword);

        if (hashedOldPassword != Password)
            return false;

        Password = passwordHasher.HashPassword(Salt, newPassword);
        return true;
    }

    public void Delete()
    {
        IsDeleted = true;
    }

    public void AddProfile(ProfileBase profile)
    {
        profile.UserId = UserId;
        Profiles.Add(profile);
    }

    public void SetCurrentProfileId(Guid profileId)
    {
        CurrentProfileId = profileId;
    }

    public void SetDefaultProfileId(Guid profileId)
    {
        DefaultProfileId = profileId;
    }
}
