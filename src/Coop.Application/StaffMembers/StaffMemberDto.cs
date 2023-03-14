using System;

namespace Coop.Application.Features;

 public class StaffMemberDto : ProfileDto
 {
     public Guid StaffMemberId { get; set; }
     public string JobTitle { get; set; }
 }
