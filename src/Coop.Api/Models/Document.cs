using System;
using System.ComponentModel.DataAnnotations;

namespace Coop.Api.Models
{
    public class Document
    {
        public Guid DocumentId { get; set; }
        public Guid PdfDigitalAssetId { get; private set; }
        public string Name { get; set; }
        public DateTime? Published { get; set; }

        public Document(Guid pdfDigitialAssetId, string name)
        {
            PdfDigitalAssetId = pdfDigitialAssetId;
            Name = name;
        }

        protected Document()
        {

        }
    }
}
