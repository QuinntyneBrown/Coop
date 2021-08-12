using Coop.Api.Models;

namespace Coop.Api.Features
{
    public static class ReportExtensions
    {
        public static ReportDto ToDto(this Report report)
        {
            return new()
            {
                ReportId = report.ReportId,
                Name = report.Name,
                PdfDigitalAssetId = report.PdfDigitalAssetId,
                Published = report.Published,
                CreatedById = report.CreatedById
            };
        }
    }
}
