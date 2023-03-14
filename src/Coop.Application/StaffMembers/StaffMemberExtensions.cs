// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain.Entities;

namespace Coop.Application.Features;

public static class StaffMemberExtensions
{
    public static StaffMemberDto ToDto(this StaffMember staffMember)
    {
        return new()
        {
            StaffMemberId = staffMember.StaffMemberId,
            ProfileId = staffMember.ProfileId,
            JobTitle = staffMember.JobTitle,
            Firstname = staffMember.Firstname,
            Lastname = staffMember.Lastname,
            PhoneNumber = staffMember.PhoneNumber,
            AvatarDigitalAssetId = staffMember.AvatarDigitalAssetId
        };
    }
}

