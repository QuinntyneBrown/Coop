using System;

namespace Coop.Api.Features
{
    public class StaffMemberDto
    {
        public Guid StaffMemberId { get; set; }
        public Guid UserId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string JobTitle { get; set; }
    }
}
