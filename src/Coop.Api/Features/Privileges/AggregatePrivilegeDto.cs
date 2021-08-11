using System.Collections.Generic;

namespace Coop.Api.Features
{
    public class AggregatePrivilegeDto
    {
        public string Aggregate { get; set; }
        public List<PrivilegeDto> Privileges { get; set; } = new();
    }
}
