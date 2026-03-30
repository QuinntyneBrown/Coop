using Coop.Domain.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Coop.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.UserId);
        builder.Property(u => u.Username).IsRequired().HasMaxLength(256);
        builder.Property(u => u.Password).IsRequired();
        builder.HasMany(u => u.Roles).WithMany(r => r.Users);
        builder.HasMany(u => u.Profiles).WithOne().HasForeignKey(p => p.UserId);
        builder.HasQueryFilter(u => !u.IsDeleted);
    }
}
