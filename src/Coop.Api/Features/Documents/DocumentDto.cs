using System;

namespace Coop.Api.Features
{
    public class DocumentDto
    {
        public Guid DocumentId { get; set; }
        public Guid PdfDigitalAssetId { get; set; }
        public string Name { get; set; }
        public DateTime? Published { get; set; }
        public Guid CreatedById { get; set; }
    }
}
