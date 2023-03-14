using System;
using Coop.Domain.Entities;

namespace Coop.Application.Features;

 public static class OnCallExtensions
 {
     public static OnCallDto ToDto(this OnCall onCall)
     {
         return new()
         {
             OnCallId = onCall.OnCallId
         };
     }
 }
