using Coop.Domain.Entities;
using MediatR;
using System;

namespace Coop.Domain.DomainEvents
{
    public class CreateProfile : BaseDomainEvent, INotification
    {
        public Guid ProfileId { get; set; } = Guid.NewGuid();
        public string Firstname { get; private set; }
        public string Lastname { get; private set; }
        public Guid? AvatarDigitalAssetId { get; private set; }
        public string ProfileType { get; private set; }
        public Address Address { get; set; }

        public CreateProfile(string profileType, string firstname, string lastname, Guid? avatarDigitalAssetId)
        {
            ProfileType = profileType;
            Firstname = firstname;
            Lastname = lastname;
            AvatarDigitalAssetId = avatarDigitalAssetId;
        }
    }
}
