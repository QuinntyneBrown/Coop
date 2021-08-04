using System;
using System.Linq;
using Coop.Api.Models;

namespace Coop.Api.Features
{
    public static class RoleExtensions
    {
        public static RoleDto ToDto(this Role role)
        {
            return new()
            {
                RoleId = role.RoleId,
                Name = role.Name,
                Privileges = role.Privileges.Select(x => x.ToDto()).ToList()
            };
        }

    }
}
