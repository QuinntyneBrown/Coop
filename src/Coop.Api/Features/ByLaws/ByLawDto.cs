using System;

namespace Coop.Api.Features
{
    public class ByLawDto
    {
        public Guid ByLawId { get; set; }
        public Guid PdfDigitalAssetId { get; set; }
        public string Name { get; set; }
    }
}
