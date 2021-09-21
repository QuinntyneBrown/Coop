using System;

namespace Coop.Api.Features
{
    public class InvitationTokenDto
    {
        public Guid InvitationTokenId { get; set; }
        public string Value { get; set; }
        public DateTime? Expiry { get; set; }
    }
}
