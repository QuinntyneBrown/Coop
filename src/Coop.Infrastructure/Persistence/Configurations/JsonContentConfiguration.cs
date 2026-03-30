using Coop.Domain.CMS;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Coop.Infrastructure.Persistence.Configurations;

public class JsonContentConfiguration : IEntityTypeConfiguration<JsonContent>
{
    public void Configure(EntityTypeBuilder<JsonContent> builder)
    {
        builder.HasKey(j => j.JsonContentId);
        builder.Property(j => j.Name).IsRequired().HasMaxLength(256);
    }
}
