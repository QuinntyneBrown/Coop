// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain.Entities;
using System.Linq;

namespace Coop.Application.Features;

public static class RoleExtensions
{
    public static RoleDto ToDto(this Role role)
    {
        return new()
        {
            RoleId = role?.RoleId,
            Name = role?.Name,
            Privileges = role?.Privileges?.Select(x => x.ToDto()).ToList(),
            AggregatePrivileges = role?.Privileges
            .OrderBy(x => x.Aggregate)
            .ThenBy(x => x.AccessRight)
            .GroupBy(x => x.Aggregate)
            .Select(g => new AggregatePrivilegeDto
            {
                Aggregate = g.Key,
                Privileges = g.Select(x => x.ToDto()).ToList()
            })
            .ToList()
        };
    }
}

