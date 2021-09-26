using Coop.Core.Models;

namespace Coop.Api.Features
{
    public static class ByLawExtensions
    {
        public static ByLawDto ToDto(this ByLaw byLaw)
        {
            return new()
            {
                ByLawId = byLaw.ByLawId,
                Name = byLaw.Name,
                PdfDigitalAssetId = byLaw.PdfDigitalAssetId,
                Published = byLaw.Published,
                CreatedById = byLaw.CreatedById
            };
        }

    }
}
