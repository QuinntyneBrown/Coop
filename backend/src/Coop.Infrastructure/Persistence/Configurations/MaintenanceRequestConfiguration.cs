using Coop.Domain.Maintenance;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Coop.Infrastructure.Persistence.Configurations;

public class MaintenanceRequestConfiguration : IEntityTypeConfiguration<MaintenanceRequest>
{
    public void Configure(EntityTypeBuilder<MaintenanceRequest> builder)
    {
        builder.HasKey(m => m.MaintenanceRequestId);
        builder.Property(m => m.Title).HasMaxLength(512);
        builder.HasMany(m => m.Comments).WithOne().HasForeignKey(c => c.MaintenanceRequestId);
        builder.HasMany(m => m.DigitalAssets).WithOne().HasForeignKey(d => d.MaintenanceRequestId);
    }
}
