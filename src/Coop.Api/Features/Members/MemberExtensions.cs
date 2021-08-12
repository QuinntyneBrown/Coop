using System;
using Coop.Api.Models;

namespace Coop.Api.Features
{
    public static class MemberExtensions
    {
        public static MemberDto ToDto(this Member member)
        {
            return new()
            {
                MemberId = member.MemberId,
                Firstname = member.Firstname,
                Lastname = member.Lastname,
                PhoneNumber = member.PhoneNumber,
                AvatarDigitalAssetId = member.AvatarDigitalAssetId
            };
        }

    }
}
