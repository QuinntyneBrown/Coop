using System;
using System.Collections.Generic;

namespace Coop.Api.Features
{
    public class RoleDto
    {
        public Guid RoleId { get; set; }
        public string Name { get; set; }
        public List<PrivilegeDto> Privileges { get; set; } = new();
    }
}
