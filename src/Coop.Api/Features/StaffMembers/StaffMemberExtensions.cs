using System;
using Coop.Api.Models;

namespace Coop.Api.Features
{
    public static class StaffMemberExtensions
    {
        public static StaffMemberDto ToDto(this StaffMember staffMember)
        {
            return new()
            {
                StaffMemberId = staffMember.StaffMemberId
            };
        }

    }
}
