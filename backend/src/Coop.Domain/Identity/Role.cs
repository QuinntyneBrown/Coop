namespace Coop.Domain.Identity;

public class Role
{
    public Guid RoleId { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public List<User> Users { get; set; } = new();
    public List<Privilege> Privileges { get; set; } = new();

    public void AddPrivilege(Privilege privilege)
    {
        privilege.RoleId = RoleId;
        Privileges.Add(privilege);
    }

    public void RemovePrivilege(Privilege privilege)
    {
        Privileges.Remove(privilege);
    }
}
