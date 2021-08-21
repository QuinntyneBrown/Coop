using Coop.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Innofactor.EfCoreJsonValueConverter;

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
