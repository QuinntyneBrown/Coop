// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Profile.Domain.Entities;

namespace Profile.Domain.Interfaces;

public interface IProfileDbContext
{
    DbSet<ProfileBase> Profiles { get; }
    DbSet<Member> Members { get; }
    DbSet<StaffMember> StaffMembers { get; }
    DbSet<BoardMember> BoardMembers { get; }
    DbSet<InvitationToken> InvitationTokens { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
