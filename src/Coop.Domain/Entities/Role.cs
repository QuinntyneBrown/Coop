using System;
using System.Collections.Generic;

namespace Coop.Domain.Entities
{
    public class Role
    {
        public Guid RoleId { get; private set; }
        public string Name { get; private set; }
        public List<User> Users { get; private set; } = new();
        public List<Privilege> Privileges { get; private set; } = new();
        public Role(string name)
        {
            Name = name;
        }

        private Role()
        {

        }

        public void Deconstruct(
            out Guid roleId,
            out string name
            )
        {
            roleId = RoleId;
            name = Name;
        }
    }
}
