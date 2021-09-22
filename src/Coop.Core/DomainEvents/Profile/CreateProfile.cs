using MediatR;
using System;

namespace Coop.Core.DomainEvents
{
    public class CreateProfile : INotification
    {
        public string Firstname { get; private set; }
        public string Lastname { get; private set; }
        public Guid? AvatarDigitalAssetId { get; private set; }
        public string ProfileType { get; private set; }

        public CreateProfile(string profileType, string firstname, string lastname, Guid? avatarDigitalAssetId)
        {
            ProfileType = profileType;
            Firstname = firstname;
            Lastname = lastname;
            AvatarDigitalAssetId = avatarDigitalAssetId;
        }
    }
}
