using System;

namespace Coop.Api.Features
{
    public class ReportDto
    {
        public Guid ReportId { get; set; }
        public Guid PdfDigitalAssetId { get; set; }
        public string Name { get; set; }
    }
}
