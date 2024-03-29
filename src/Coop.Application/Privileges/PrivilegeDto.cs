// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain.Enums;
using Coop.Domain.Entities;
using System;

namespace Coop.Application.Features;

public class PrivilegeDto
{
    public Guid PrivilegeId { get; set; }
    public Guid RoleId { get; set; }
    public AccessRight AccessRight { get; set; }
    public string Aggregate { get; set; }
}

