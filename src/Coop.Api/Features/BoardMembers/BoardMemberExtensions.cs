using System;
using Coop.Api.Models;

namespace Coop.Api.Features
{
    public static class BoardMemberExtensions
    {
        public static BoardMemberDto ToDto(this BoardMember boardMember)
        {
            return new()
            {
                BoardMemberId = boardMember.BoardMemberId
            };
        }

    }
}
