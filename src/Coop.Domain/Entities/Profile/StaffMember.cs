using Coop.Domain.Enums;
using System;

namespace Coop.Domain.Entities;

 public class StaffMember : Profile
 {
     public Guid StaffMemberId { get; private set; }
     public string JobTitle { get; private set; }
     public StaffMember(Guid userId, string jobTitle, string firstname, string lastname)
         : base(ProfileType.StaffMember, userId, firstname, lastname)
     {
         JobTitle = jobTitle;
     }
     public StaffMember(string firstname, string lastname, Guid? avatarDigitalAssetId = null)
         : base(ProfileType.StaffMember, firstname, lastname, avatarDigitalAssetId)
     {
     }
     private StaffMember()
     {
     }
 }
