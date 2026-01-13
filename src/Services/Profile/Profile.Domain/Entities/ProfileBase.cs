// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Profile.Domain.Enums;

namespace Profile.Domain.Entities;

public class ProfileBase
{
    public Guid ProfileId { get; protected set; } = Guid.NewGuid();
    public Guid UserId { get; protected set; }
    public ProfileType Type { get; protected set; }
    public string FirstName { get; protected set; } = string.Empty;
    public string LastName { get; protected set; } = string.Empty;
    public string? PhoneNumber { get; protected set; }
    public Guid? AvatarDigitalAssetId { get; protected set; }
    public DateTime CreatedAt { get; protected set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; protected set; }

    protected ProfileBase() { }

    public ProfileBase(ProfileType type, Guid userId, string firstName, string lastName)
    {
        Type = type;
        UserId = userId;
        FirstName = firstName;
        LastName = lastName;
    }

    public void SetAvatar(Guid digitalAssetId)
    {
        AvatarDigitalAssetId = digitalAssetId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetPhoneNumber(string phoneNumber)
    {
        PhoneNumber = phoneNumber;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateName(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName;
        UpdatedAt = DateTime.UtcNow;
    }
}
