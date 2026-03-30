using Coop.Domain.Profiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Coop.Infrastructure.Persistence.Configurations;

public class ProfileBaseConfiguration : IEntityTypeConfiguration<ProfileBase>
{
    public void Configure(EntityTypeBuilder<ProfileBase> builder)
    {
        builder.HasKey(p => p.ProfileId);
        builder.Property(p => p.Firstname).IsRequired().HasMaxLength(256);
        builder.Property(p => p.Lastname).IsRequired().HasMaxLength(256);
        builder.Ignore(p => p.Fullname);
    }
}
