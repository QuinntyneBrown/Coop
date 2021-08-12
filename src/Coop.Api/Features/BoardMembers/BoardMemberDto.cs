using System;

namespace Coop.Api.Features
{
    public class BoardMemberDto: ProfileDto
    {
        public Guid BoardMemberId { get; set; }
        public string BoardTitle { get; set; }
    }
}
