using Coop.Domain.Entities;

namespace Coop.Application.Features;

public static class ByLawExtensions
{
    public static ByLawDto ToDto(this ByLaw byLaw)
    {
        return new()
        {
            ByLawId = byLaw.ByLawId,
            DocumentId = byLaw.DocumentId,
            Name = byLaw.Name,
            DigitalAssetId = byLaw.DigitalAssetId,
            Published = byLaw.Published,
            CreatedById = byLaw.CreatedById
        };
    }
}
