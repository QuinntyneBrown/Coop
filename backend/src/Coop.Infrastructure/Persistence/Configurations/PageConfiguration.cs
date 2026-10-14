using Coop.Domain.CMS;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Coop.Infrastructure.Persistence.Configurations;

public class PageConfiguration : IEntityTypeConfiguration<Page>
{
    public void Configure(EntityTypeBuilder<Page> builder)
    {
        builder.HasKey(p => p.PageId);
        builder.Property(p => p.Title).IsRequired().HasMaxLength(120);
        builder.Property(p => p.Slug).IsRequired().HasMaxLength(Page.SlugMaxLength);
        builder.Property(p => p.HeroImageUrl).HasMaxLength(2048);
        builder.Property(p => p.HeroImageAlt).HasMaxLength(250);
        builder.Property(p => p.Body).IsRequired();
        builder.HasIndex(p => p.Slug);
    }
}
