using System;
using Coop.Api.Models;

namespace Coop.Api.Features
{
    public static class InvitationTokenExtensions
    {
        public static InvitationTokenDto ToDto(this InvitationToken invitationToken)
        {
            return new()
            {
                InvitationTokenId = invitationToken.InvitationTokenId
            };
        }

    }
}
