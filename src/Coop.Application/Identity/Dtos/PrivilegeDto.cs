using Coop.Domain.Identity;

namespace Coop.Application.Identity.Dtos;

public class PrivilegeDto
{
    public Guid PrivilegeId { get; set; }
    public Guid RoleId { get; set; }
    public AccessRight AccessRight { get; set; }
    public string Aggregate { get; set; } = string.Empty;

    public static PrivilegeDto FromPrivilege(Privilege privilege)
    {
        return new PrivilegeDto
        {
            PrivilegeId = privilege.PrivilegeId,
            RoleId = privilege.RoleId,
            AccessRight = privilege.AccessRight,
            Aggregate = privilege.Aggregate
        };
    }
}
