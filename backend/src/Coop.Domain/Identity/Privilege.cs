namespace Coop.Domain.Identity;

public class Privilege
{
    public Guid PrivilegeId { get; set; } = Guid.NewGuid();
    public Guid RoleId { get; set; }
    public AccessRight AccessRight { get; set; }
    public string Aggregate { get; set; } = string.Empty;
}
