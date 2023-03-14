// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;

namespace Coop.Application.Features;

public class StaffMemberDto : ProfileDto
{
    public Guid StaffMemberId { get; set; }
    public string JobTitle { get; set; }
}

