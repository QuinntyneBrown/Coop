using System;

namespace Coop.Api.Models
{
    public class BoardMember: Profile
    {
        public Guid BoardMemberId { get; set; }
        public string BoardTitle { get; private set; }

        public BoardMember(Guid userId, string boardTitle, string firstname, string lastname)
            : base(ProfileType.BoardMember, userId, firstname, lastname)
        {
            BoardTitle = boardTitle;
        }

        private BoardMember()
        {

        }
    }
}
