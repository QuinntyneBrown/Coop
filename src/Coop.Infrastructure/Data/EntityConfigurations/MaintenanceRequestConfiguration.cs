using Coop.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Coop.Infrastructure.Data.EntityConfigurations;

 public class MaintenanceRequestConfiguration : IEntityTypeConfiguration<MaintenanceRequest>
 {
     public void Configure(EntityTypeBuilder<MaintenanceRequest> builder)
     {
     }
 }
