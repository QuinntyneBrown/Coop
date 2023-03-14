using Coop.Domain.Entities;

namespace Coop.Application.BoardMembers;

 public static class BoardMemberExtensions
 {
     public static BoardMemberDto ToDto(this BoardMember boardMember)
     {
         return new()
         {
             ProfileId = boardMember.ProfileId,
             UserId = boardMember.UserId,
             BoardMemberId = boardMember.BoardMemberId,
             BoardTitle = boardMember.BoardTitle,
             Firstname = boardMember.Firstname,
             Lastname = boardMember.Lastname,
             PhoneNumber = boardMember.PhoneNumber,
             AvatarDigitalAssetId = boardMember.AvatarDigitalAssetId
         };
     }
 }
