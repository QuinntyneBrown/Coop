using Coop.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Coop.Infrastructure.Data.EntityConfigurations;

 public class UserConfiguration : IEntityTypeConfiguration<User>
 {
     public void Configure(EntityTypeBuilder<User> builder)
     {
         builder
             .HasQueryFilter(p => !p.IsDeleted)
             .HasIndex(x => x.Username)
             .IsUnique();
     }
 }
