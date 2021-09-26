using System;
using System.Collections.Generic;

namespace Coop.Core.Models
{
    public class Profile
    {
        public Guid ProfileId { get; protected set; }
        public Guid? UserId { get; protected set; }
        public string Firstname { get; protected set; }
        public string Lastname { get; protected set; }
        public Guid? AvatarDigitalAssetId { get; protected set; }
        public string PhoneNumber { get; protected set; }
        public Address Address { get; protected set; }
        public User User { get; protected set; }
        public ProfileType Type { get; protected set; }
        public List<Message> Messages { get; protected set; } = new();
        public List<Conversation> Conversations { get; protected set; } = new();
        public Profile(ProfileType type, Guid userId, string firstname, string lastname)
        {
            Type = type;
            UserId = userId;
            Firstname = firstname;
            Lastname = lastname;
        }

        public Profile(ProfileType type, string firstname, string lastname, Guid? avatarDigitalAssetId)
        {
            Type = type;
            Firstname = firstname;
            Lastname = lastname;
            AvatarDigitalAssetId = avatarDigitalAssetId;
        }

        public Profile(ProfileType type, string firstname, string lastname)
        {
            Type = type;
            Firstname = firstname;
            Lastname = lastname;
        }

        protected Profile()
        {

        }

        public Profile SetAvatar(Guid? digitalAssetId)
        {
            AvatarDigitalAssetId = digitalAssetId;
            return this;
        }
    }
}