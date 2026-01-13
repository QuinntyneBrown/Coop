// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Profile.Domain.Entities;

namespace Profile.Infrastructure.Data.EntityConfigurations;

public class ProfileConfiguration : IEntityTypeConfiguration<ProfileBase>
{
    public void Configure(EntityTypeBuilder<ProfileBase> builder)
    {
        builder.HasKey(x => x.ProfileId);
        builder.HasIndex(x => x.UserId);

        builder.Property(x => x.FirstName)
            .HasMaxLength(128);

        builder.Property(x => x.LastName)
            .HasMaxLength(128);

        builder.Property(x => x.PhoneNumber)
            .HasMaxLength(32);

        builder.HasDiscriminator(x => x.Type)
            .HasValue<ProfileBase>(Domain.Enums.ProfileType.Support)
            .HasValue<Member>(Domain.Enums.ProfileType.Member)
            .HasValue<StaffMember>(Domain.Enums.ProfileType.Staff)
            .HasValue<BoardMember>(Domain.Enums.ProfileType.BoardMember);
    }
}

public class MemberConfiguration : IEntityTypeConfiguration<Member>
{
    public void Configure(EntityTypeBuilder<Member> builder)
    {
        builder.OwnsOne(x => x.Address, a =>
        {
            a.Property(p => p.Street).HasMaxLength(256);
            a.Property(p => p.Unit).HasMaxLength(64);
            a.Property(p => p.City).HasMaxLength(128);
            a.Property(p => p.Province).HasMaxLength(64);
            a.Property(p => p.PostalCode).HasMaxLength(16);
        });
    }
}

public class StaffMemberConfiguration : IEntityTypeConfiguration<StaffMember>
{
    public void Configure(EntityTypeBuilder<StaffMember> builder)
    {
        builder.Property(x => x.JobTitle)
            .HasMaxLength(128);
    }
}

public class BoardMemberConfiguration : IEntityTypeConfiguration<BoardMember>
{
    public void Configure(EntityTypeBuilder<BoardMember> builder)
    {
        builder.Property(x => x.BoardTitle)
            .HasMaxLength(128);
    }
}
