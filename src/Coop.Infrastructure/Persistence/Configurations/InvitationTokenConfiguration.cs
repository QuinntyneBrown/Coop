using Coop.Domain.Onboarding;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Coop.Infrastructure.Persistence.Configurations;

public class InvitationTokenConfiguration : IEntityTypeConfiguration<InvitationToken>
{
    public void Configure(EntityTypeBuilder<InvitationToken> builder)
    {
        builder.HasKey(i => i.InvitationTokenId);
        builder.Property(i => i.Value).IsRequired().HasMaxLength(512);
        builder.HasIndex(i => i.Value).IsUnique();
    }
}
