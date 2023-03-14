using System;

namespace Coop.Application.Features;

 public class InvitationTokenDto
 {
     public Guid InvitationTokenId { get; set; }
     public string Value { get; set; }
     public DateTime? Expiry { get; set; }
 }
