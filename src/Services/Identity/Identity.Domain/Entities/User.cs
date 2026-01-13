// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Security.Cryptography;
using Identity.Domain.Interfaces;

namespace Identity.Domain.Entities;

public class User
{
    public Guid UserId { get; private set; } = Guid.NewGuid();
    public string Username { get; private set; } = string.Empty;
    public string Password { get; private set; } = string.Empty;
    public byte[] Salt { get; private set; } = Array.Empty<byte>();
    public List<Role> Roles { get; private set; } = new();
    public Guid? CurrentProfileId { get; private set; }
    public Guid? DefaultProfileId { get; private set; }
    public bool IsDeleted { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; private set; }

    private User() { }

    public User(string username, string password, IPasswordHasher passwordHasher)
    {
        Salt = new byte[128 / 8];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(Salt);
        }
        Username = username;
        Password = passwordHasher.HashPassword(Salt, password);
    }

    public void SetDefaultProfileId(Guid profileId)
    {
        DefaultProfileId = profileId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetCurrentProfileId(Guid profileId)
    {
        CurrentProfileId = profileId;
        UpdatedAt = DateTime.UtcNow;
    }

    public User ChangePassword(string oldPassword, string newPassword, IPasswordHasher passwordHasher)
    {
        if (Password != passwordHasher.HashPassword(Salt, oldPassword))
        {
            throw new InvalidOperationException("Old password is invalid");
        }
        var newPasswordHash = passwordHasher.HashPassword(Salt, newPassword);
        if (Password == newPasswordHash)
        {
            throw new InvalidOperationException("New password must be different from old password");
        }
        Password = newPasswordHash;
        UpdatedAt = DateTime.UtcNow;
        return this;
    }

    public User SetPassword(string password, IPasswordHasher passwordHasher)
    {
        Password = passwordHasher.HashPassword(Salt, password);
        UpdatedAt = DateTime.UtcNow;
        return this;
    }

    public User SetUsername(string username)
    {
        Username = username;
        UpdatedAt = DateTime.UtcNow;
        return this;
    }

    public User Delete()
    {
        IsDeleted = true;
        UpdatedAt = DateTime.UtcNow;
        return this;
    }

    public void AddRole(Role role)
    {
        if (!Roles.Any(r => r.RoleId == role.RoleId))
        {
            Roles.Add(role);
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public void RemoveRole(Role role)
    {
        var existingRole = Roles.FirstOrDefault(r => r.RoleId == role.RoleId);
        if (existingRole != null)
        {
            Roles.Remove(existingRole);
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public bool ValidatePassword(string password, IPasswordHasher passwordHasher)
    {
        return Password == passwordHasher.HashPassword(Salt, password);
    }
}
