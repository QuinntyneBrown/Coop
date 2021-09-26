using Coop.Core.Models;
using Innofactor.EfCoreJsonValueConverter;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Coop.Api.Data
{
    public class JsonContentConfiguration : IEntityTypeConfiguration<JsonContent>
    {
        public void Configure(EntityTypeBuilder<JsonContent> builder)
        {
            builder.Property(e => e.Json).HasJsonValueConversion();
        }
    }
}
