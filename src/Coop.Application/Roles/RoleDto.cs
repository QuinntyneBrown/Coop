// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using System.Collections.Generic;

namespace Coop.Application.Features;

public class RoleDto
{
    public Guid? RoleId { get; set; }
    public string Name { get; set; }
    public List<PrivilegeDto> Privileges { get; set; } = new();
    public List<AggregatePrivilegeDto> AggregatePrivileges { get; set; } = new();
}

