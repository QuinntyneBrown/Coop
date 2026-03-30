using System.Security.Cryptography;
using Coop.Domain.Identity;
using Coop.SharedKernel;
using Coop.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api;

public static class SeedData
{
    public static async Task SeedAsync(CoopDbContext context, IPasswordHasher passwordHasher)
    {
        // Ensure database created
        await context.Database.EnsureCreatedAsync();

        // Seed Roles if none exist
        if (!await context.Roles.IgnoreQueryFilters().AnyAsync())
        {
            var memberRole = new Role { Name = Constants.Roles.Member };
            var staffRole = new Role { Name = Constants.Roles.Staff };
            var boardMemberRole = new Role { Name = Constants.Roles.BoardMember };
            var sysAdminRole = new Role { Name = Constants.Roles.SystemAdministrator };
            var supportRole = new Role { Name = Constants.Roles.Support };

            // Add full access privileges to SystemAdministrator
            foreach (var aggregate in Constants.Aggregates.All)
            {
                sysAdminRole.AddPrivilege(new Privilege { AccessRight = AccessRight.Delete, Aggregate = aggregate });
            }

            // Add read privileges to Member role
            foreach (var aggregate in Constants.Aggregates.All)
            {
                memberRole.AddPrivilege(new Privilege { AccessRight = AccessRight.Read, Aggregate = aggregate });
            }

            // Add read/write to Staff
            foreach (var aggregate in Constants.Aggregates.All)
            {
                staffRole.AddPrivilege(new Privilege { AccessRight = AccessRight.Write, Aggregate = aggregate });
            }

            // Add read/write/create to BoardMember
            foreach (var aggregate in Constants.Aggregates.All)
            {
                boardMemberRole.AddPrivilege(new Privilege { AccessRight = AccessRight.Create, Aggregate = aggregate });
            }

            // Support gets read/write
            foreach (var aggregate in Constants.Aggregates.All)
            {
                supportRole.AddPrivilege(new Privilege { AccessRight = AccessRight.Write, Aggregate = aggregate });
            }

            context.Roles.AddRange(memberRole, staffRole, boardMemberRole, sysAdminRole, supportRole);
            await context.SaveChangesAsync();

            // Seed admin user
            var adminSalt = new byte[16];
            RandomNumberGenerator.Fill(adminSalt);
            var adminUser = new User
            {
                Username = "admin",
                Salt = adminSalt,
                Password = passwordHasher.HashPassword(adminSalt, "Admin123!")
            };
            adminUser.Roles.Add(sysAdminRole);
            context.Users.Add(adminUser);

            // Seed member user
            var memberSalt = new byte[16];
            RandomNumberGenerator.Fill(memberSalt);
            var memberUser = new User
            {
                Username = "member",
                Salt = memberSalt,
                Password = passwordHasher.HashPassword(memberSalt, "Member123!")
            };
            memberUser.Roles.Add(memberRole);
            context.Users.Add(memberUser);

            await context.SaveChangesAsync();
        }
    }
}
