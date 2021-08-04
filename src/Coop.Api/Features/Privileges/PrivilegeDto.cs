using Coop.Api.Models;
using System;

namespace Coop.Api.Features
{
    public class PrivilegeDto
    {
        public Guid PrivilegeId { get; set; }
        public AccessRight AccessRight { get; set; }
        public string Aggregate { get; set; }
    }
}
