using Coop.Domain.Tenancy;

namespace Coop.Domain.Identity;

public class Privilege : ITenantOwned
{
    public Guid PrivilegeId { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public Guid RoleId { get; set; }
    public AccessRight AccessRight { get; set; }
    public string Aggregate { get; set; } = string.Empty;
}
