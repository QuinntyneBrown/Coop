using Coop.Domain.Entities;

namespace Coop.Application.Features;

 public static class InvitationTokenExtensions
 {
     public static InvitationTokenDto ToDto(this InvitationToken invitationToken)
     {
         return new()
         {
             InvitationTokenId = invitationToken.InvitationTokenId,
             Value = invitationToken.Value,
             Expiry = invitationToken.Expiry
         };
     }
 }
