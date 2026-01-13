// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Profile.Domain.Entities;
using Profile.Domain.Interfaces;

namespace Profile.Infrastructure.Data;

public class ProfileDbContext : DbContext, IProfileDbContext
{
    public DbSet<ProfileBase> Profiles => Set<ProfileBase>();
    public DbSet<Member> Members => Set<Member>();
    public DbSet<StaffMember> StaffMembers => Set<StaffMember>();
    public DbSet<BoardMember> BoardMembers => Set<BoardMember>();
    public DbSet<InvitationToken> InvitationTokens => Set<InvitationToken>();

    public ProfileDbContext(DbContextOptions<ProfileDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ProfileDbContext).Assembly);
    }
}
