// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Identity.Domain;
using Identity.Domain.Entities;
using Identity.Domain.Interfaces;

namespace Identity.Infrastructure.Data.Seeding;

public static class IdentitySeedData
{
    public const string SupportUsername = "support";
    public const string MemberUsername = "earl.plett@coop.ca";
    public const string BoardMemberUsername = "natasha.falk@coop.ca";
    public const string StaffMemberUsername = "marie.enns@coop.ca";
    public const string DefaultPassword = "password";

    public static void Seed(IdentityDbContext context, IPasswordHasher passwordHasher)
    {
        SeedRoles(context);
        SeedUsers(context, passwordHasher);
    }

    private static void SeedRoles(IdentityDbContext context)
    {
        foreach (var roleName in RoleConstants.All)
        {
            var role = context.Roles.SingleOrDefault(x => x.Name == roleName);
            if (role == null)
            {
                role = new Role(roleName);

                var aggregates = AggregateConstants.All;
                var accessRights = AccessRightConstants.FullAccess;
                var privileges = aggregates
                    .SelectMany(aggregate => accessRights.Select(accessRight => new Privilege(accessRight, aggregate)))
                    .ToList();

                foreach (var privilege in privileges)
                {
                    role.AddPrivilege(privilege);
                }

                // Remove certain privileges for Member role
                if (role.Name == RoleConstants.Member)
                {
                    role.Privileges.RemoveAll(x => x.Aggregate == AggregateConstants.User);
                    role.Privileges.RemoveAll(x => x.Aggregate == AggregateConstants.Role);
                    role.Privileges.RemoveAll(x => x.Aggregate == AggregateConstants.MaintenanceRequest);
                    role.Privileges.RemoveAll(x => x.Aggregate == AggregateConstants.ByLaw);
                    role.Privileges.RemoveAll(x => x.Aggregate == AggregateConstants.Member);
                    role.Privileges.RemoveAll(x => x.Aggregate == AggregateConstants.Notice);
                    role.Privileges.RemoveAll(x => x.Aggregate == AggregateConstants.StaffMember);
                    role.Privileges.RemoveAll(x => x.Aggregate == AggregateConstants.BoardMember);
                }

                // Remove certain privileges for BoardMember role
                if (role.Name == RoleConstants.BoardMember)
                {
                    role.Privileges.RemoveAll(x => x.Aggregate == AggregateConstants.User);
                    role.Privileges.RemoveAll(x => x.Aggregate == AggregateConstants.Role);
                    role.Privileges.RemoveAll(x => x.Aggregate == AggregateConstants.MaintenanceRequest);
                }

                context.Roles.Add(role);
                context.SaveChanges();
            }
        }
    }

    private static void SeedUsers(IdentityDbContext context, IPasswordHasher passwordHasher)
    {
        var users = new List<(string Username, string[] Roles)>
        {
            (MemberUsername, new[] { RoleConstants.Member }),
            (BoardMemberUsername, new[] { RoleConstants.BoardMember }),
            (StaffMemberUsername, new[] { RoleConstants.Staff, RoleConstants.SystemAdministrator }),
            (SupportUsername, new[] { RoleConstants.Support })
        };

        foreach (var (username, roleNames) in users)
        {
            var entity = context.Users.SingleOrDefault(x => x.Username == username);
            if (entity == null)
            {
                var user = new User(username, DefaultPassword, passwordHasher);

                foreach (var roleName in roleNames)
                {
                    var role = context.Roles.Single(x => x.Name == roleName);
                    user.AddRole(role);
                }

                context.Users.Add(user);
            }
        }

        context.SaveChanges();
    }
}
