using Coop.Domain.Documents;

namespace Coop.Application.Documents.Dtos;

public class ByLawDto : DocumentDto
{
    public static ByLawDto FromByLaw(ByLaw byLaw)
    {
        return new ByLawDto
        {
            DocumentId = byLaw.DocumentId,
            Name = byLaw.Name,
            DigitalAssetId = byLaw.DigitalAssetId,
            CreatedOn = byLaw.CreatedOn,
            Published = byLaw.Published
        };
    }
}
