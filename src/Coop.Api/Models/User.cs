using Coop.Api.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;

namespace Coop.Api.Models
{
    public class User
    {
        public Guid UserId { get; private set; }
        public string Username { get; private set; }
        public string Password { get; private set; }
        public byte[] Salt { get; private set; }
        public List<Role> Roles { get; private set; } = new();
        public List<Profile> Profiles { get; private set; } = new();
        public Guid CurrentProfileId { get; private set; }
        public Guid DefaultProfileId { get; private set; }
        public bool IsDeleted { get; private set; }
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

        private User()
        {

        }

        public void SetDefaultProfileId(Guid profileId)
        {
            DefaultProfileId = profileId;
        }

        public void SetCurrentProfileId(Guid profileId)
        {
            CurrentProfileId = profileId;
        }

        public void AddProfile(Profile profile)
        {
            if (!Profiles.Contains(profile))
            {
                Profiles.Add(profile);
            }

            if (Profiles.Count() == 1)
            {
                SetCurrentProfileId(profile.ProfileId);

                SetDefaultProfileId(profile.ProfileId);
            }
        }

        public User ChangePassword(string oldPassword, string newPassword, IPasswordHasher passwordHasher)
        {
            if (Password != passwordHasher.HashPassword(Salt, oldPassword))
            {
                throw new Exception("Old password is invalid");
            }

            var newPasswordHash = passwordHasher.HashPassword(Salt, newPassword);

            if (Password == newPassword)
            {
                throw new Exception("Changed password is equal to old password");
            }

            Password = newPasswordHash;

            return this;
        }

        public User SetPassword(string password, IPasswordHasher passwordHasher)
        {
            Password = passwordHasher.HashPassword(Salt, password);

            return this;
        }

        public User SetUsername(string username)
        {
            Username = username;

            return this;
        }

        public User Delete()
        {
            IsDeleted = true;

            return this;
        }
    }
}
