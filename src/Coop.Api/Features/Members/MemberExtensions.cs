using System;
using Coop.Api.Extensions;
using Coop.Core.Models;

namespace Coop.Api.Features
{
    public static class MemberExtensions
    {
        public static MemberDto ToDto(this Member member)
        {
            return new()
            {
                MemberId = member.MemberId,
                ProfileId = member.ProfileId,
                Firstname = member.Firstname,
                Lastname = member.Lastname,
                PhoneNumber = member.PhoneNumber,
                AvatarDigitalAssetId = member.AvatarDigitalAssetId,
                Address = member.Address.ToDto()
            };
        }

    }
}
