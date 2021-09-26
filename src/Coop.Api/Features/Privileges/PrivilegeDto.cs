using Coop.Core.Models;
using System;

namespace Coop.Api.Features
{
    public class PrivilegeDto
    {
        public Guid PrivilegeId { get; set; }
        public Guid RoleId { get; set; }
        public AccessRight AccessRight { get; set; }
        public string Aggregate { get; set; }
    }
}
