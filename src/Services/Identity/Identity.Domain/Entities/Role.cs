// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Identity.Domain.Entities;

public class Role
{
    public Guid RoleId { get; private set; } = Guid.NewGuid();
    public string Name { get; private set; } = string.Empty;
    public List<Privilege> Privileges { get; private set; } = new();
    public List<User> Users { get; private set; } = new();

    private Role() { }

    public Role(string name)
    {
        Name = name;
    }

    public void AddPrivilege(Privilege privilege)
    {
        if (!Privileges.Any(p => p.PrivilegeId == privilege.PrivilegeId))
        {
            Privileges.Add(privilege);
        }
    }

    public void RemovePrivilege(Privilege privilege)
    {
        var existing = Privileges.FirstOrDefault(p => p.PrivilegeId == privilege.PrivilegeId);
        if (existing != null)
        {
            Privileges.Remove(existing);
        }
    }
}

public static class RoleConstants
{
    public const string Member = nameof(Member);
    public const string Staff = nameof(Staff);
    public const string BoardMember = nameof(BoardMember);
    public const string SystemAdministrator = nameof(SystemAdministrator);
    public const string Support = nameof(Support);

    public static readonly string[] All = new[] { Member, Staff, BoardMember, SystemAdministrator, Support };
}
