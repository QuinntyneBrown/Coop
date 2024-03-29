// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Application.Features;
using Coop.Domain.Enums;
using System;

namespace Coop.Application.BoardMembers;

public class BoardMemberDto : ProfileDto
{
    public Guid? BoardMemberId { get; set; }
    public string BoardTitle { get; set; } = "";
    public override ProfileType Type { get; set; } = ProfileType.BoardMember;
}

