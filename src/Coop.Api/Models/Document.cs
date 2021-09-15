using System;

namespace Coop.Api.Models
{
    public class Document
    {
        public Guid DocumentId { get; set; }
        public Guid PdfDigitalAssetId { get; protected set; }
        public string Name { get; protected set; }
        public DateTime? Published { get; protected set; }
        public Guid CreatedById { get; protected set; }

        public Document(Guid pdfDigitialAssetId, string name)
        {
            PdfDigitalAssetId = pdfDigitialAssetId;
            Name = name;
        }

        protected Document()
        {

        }

        public void Publish()
        {
            if (Published.HasValue)
                throw new Exception();

            Published = DateTime.UtcNow;
        }
    }
}
