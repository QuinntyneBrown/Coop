using Coop.Domain.Maintenance;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Coop.Infrastructure.Persistence.Configurations;

public class MaintenanceRequestCommentConfiguration : IEntityTypeConfiguration<MaintenanceRequestComment>
{
    public void Configure(EntityTypeBuilder<MaintenanceRequestComment> builder)
    {
        builder.HasKey(c => c.MaintenanceRequestCommentId);
    }
}
