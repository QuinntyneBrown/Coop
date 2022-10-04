using Coop.Domain.Enums;
using System;

namespace Coop.Domain.Entities
{
    public class BoardMember : Profile
    {
        public Guid BoardMemberId { get; set; }
        public string BoardTitle { get; private set; }

        public BoardMember(Guid userId, string boardTitle, string firstname, string lastname)
            : base(ProfileType.BoardMember, userId, firstname, lastname)
        {
            BoardTitle = boardTitle;
        }

        public BoardMember(string boardTitle, string firstname, string lastname, Guid? avatarDigitalAssetId = null)
            : base(ProfileType.BoardMember, firstname, lastname, avatarDigitalAssetId)
        {
            BoardTitle = boardTitle;
        }

        public BoardMember(string firstname, string lastname, Guid? avatarDigitalAssetId = null)
            : base(ProfileType.BoardMember, firstname, lastname, avatarDigitalAssetId)
        {

        }

        private BoardMember()
        {

        }

        public void Update(string title, string firstname, string lastname, Guid? avatarDigitalAssetId)
        {
            BoardTitle = title;
            Firstname = firstname;
            Lastname = lastname;
            AvatarDigitalAssetId = avatarDigitalAssetId;
        }
    }
}
