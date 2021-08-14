using Coop.Api.Models;
using System;

namespace Coop.Api.Features
{
    public class ProfileDto
    {
        public Guid ProfileId { get; set; }
        public Guid UserId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string PhoneNumber { get; set; }
        public Guid AvatarDigitalAssetId { get; set; }
        public ProfileType Type { get; set; }
    }
}
