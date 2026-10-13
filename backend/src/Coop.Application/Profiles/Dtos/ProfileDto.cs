using Coop.Domain.Profiles;

namespace Coop.Application.Profiles.Dtos;

public class ProfileDto
{
    public Guid ProfileId { get; set; }
    public Guid? UserId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public Guid? AvatarDigitalAssetId { get; set; }
    public string? AvatarUrl { get; set; }
    public ProfileType Type { get; set; }
    public string Fullname { get; set; } = string.Empty;

    /// <summary>The address the apps show a profile picture from, or null when there is none.</summary>
    public static string? AvatarUrlFor(Guid? avatarDigitalAssetId)
        => avatarDigitalAssetId is Guid id ? $"/api/digitalasset/serve/{id}" : null;

    public static ProfileDto FromProfile(ProfileBase profile)
    {
        return new ProfileDto
        {
            ProfileId = profile.ProfileId,
            UserId = profile.UserId,
            Firstname = profile.Firstname,
            Lastname = profile.Lastname,
            PhoneNumber = profile.PhoneNumber,
            Email = profile.Email,
            AvatarDigitalAssetId = profile.AvatarDigitalAssetId,
            AvatarUrl = AvatarUrlFor(profile.AvatarDigitalAssetId),
            Type = profile.Type,
            Fullname = profile.Fullname
        };
    }
}
