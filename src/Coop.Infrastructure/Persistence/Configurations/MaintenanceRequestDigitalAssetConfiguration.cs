using Coop.Domain.Maintenance;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Coop.Infrastructure.Persistence.Configurations;

public class MaintenanceRequestDigitalAssetConfiguration : IEntityTypeConfiguration<MaintenanceRequestDigitalAsset>
{
    public void Configure(EntityTypeBuilder<MaintenanceRequestDigitalAsset> builder)
    {
        builder.HasKey(d => d.MaintenanceRequestDigitalAssetId);
    }
}
