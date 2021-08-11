using System;

namespace Coop.Api.Features
{
    public class MemberDto
    {
        public Guid MemberId { get; set; }
        public Guid UserId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string PhoneNumber { get; set; }
        public Guid AvatarDigitalAssetId { get; set; }
    }
}
