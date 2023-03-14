using Coop.Domain.Entities;

namespace Coop.Application.Features;

 public static class PrivilegeExtensions
 {
     public static PrivilegeDto ToDto(this Privilege privilege)
     {
         return new()
         {
             PrivilegeId = privilege.PrivilegeId,
             RoleId = privilege.RoleId,
             AccessRight = privilege.AccessRight,
             Aggregate = privilege.Aggregate
         };
     }
 }
