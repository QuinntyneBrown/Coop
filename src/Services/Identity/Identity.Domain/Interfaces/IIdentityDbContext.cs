// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Identity.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Identity.Domain.Interfaces;

public interface IIdentityDbContext
{
    DbSet<User> Users { get; }
    DbSet<Role> Roles { get; }
    DbSet<Privilege> Privileges { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
