using Coop.Api.Models;
using System;

namespace Coop.Api.Features
{
    public class BoardMemberDto : ProfileDto
    {
        public Guid? BoardMemberId { get; set; }
        public string BoardTitle { get; set; }
        public override ProfileType Type { get; set; } = ProfileType.BoardMember;

    }
}
