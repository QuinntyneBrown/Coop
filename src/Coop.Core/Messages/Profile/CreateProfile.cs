using MediatR;
using System;

namespace Coop.Core.Messages
{
    public class CreateProfile: INotification
    {
        public string Firstname { get; private set; }
        public string Lastname { get; private set; }
        public Guid? AvatarDigitalAssetId { get; private set; }

        public CreateProfile(string firstname, string lastname, Guid? avatarDigitalAssetId)
        {
            Firstname = firstname;
            Lastname = lastname;
            AvatarDigitalAssetId = avatarDigitalAssetId;
        }
    }
}
