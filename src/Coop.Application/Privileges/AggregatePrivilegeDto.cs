// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Collections.Generic;

namespace Coop.Application.Features;

public class AggregatePrivilegeDto
{
    public string Aggregate { get; set; }
    public List<PrivilegeDto> Privileges { get; set; } = new();
}

