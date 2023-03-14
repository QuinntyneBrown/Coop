using Coop.Domain.Enums;
using System;

namespace Coop.Domain.Entities;

 public class OnCall : Profile
 {
     public Guid OnCallId { get; set; }
     public OnCall(Guid userId, string firstname, string lastname)
         : base(ProfileType.OnCall, userId, firstname, lastname)
     {
     }
     private OnCall()
     {
     }
 }
