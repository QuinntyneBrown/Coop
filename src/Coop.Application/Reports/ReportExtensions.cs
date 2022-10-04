using Coop.Domain.Entities;

namespace Coop.Application.Features
{
    public static class ReportExtensions
    {
        public static ReportDto ToDto(this Report report)
        {
            return new()
            {
                ReportId = report.ReportId,
                DocumentId = report.DocumentId,
                Name = report.Name,
                DigitalAssetId = report.DigitalAssetId,
                Published = report.Published,
                CreatedById = report.CreatedById
            };
        }
    }
}
