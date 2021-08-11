using System;

namespace Coop.Api.Features
{
    public class BoardMemberDto
    {
        public Guid BoardMemberId { get; set; }
        public Guid UserId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string BoardTitle { get; set; }
    }
}
