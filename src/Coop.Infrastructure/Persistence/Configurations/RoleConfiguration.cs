using Coop.Domain.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Coop.Infrastructure.Persistence.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.HasKey(r => r.RoleId);
        builder.Property(r => r.Name).IsRequired().HasMaxLength(256);
        builder.HasMany(r => r.Users).WithMany(u => u.Roles);
        builder.HasMany(r => r.Privileges).WithOne().HasForeignKey(p => p.RoleId);
    }
}
