using Coop.Domain.Entities;
using Innofactor.EfCoreJsonValueConverter;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Coop.Infrastructure.Data;

 public class ThemeConfiguration : IEntityTypeConfiguration<Theme>
 {
     public void Configure(EntityTypeBuilder<Theme> builder)
     {
         builder.Property(e => e.CssCustomProperties).HasJsonValueConversion();
     }
 }
