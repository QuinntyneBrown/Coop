using System;

namespace Coop.Core.Models
{
    public class Report : Document
    {
        public Guid ReportId { get; set; }

        public Report(Guid pdfDigitalAssetId, string name)
            : base(pdfDigitalAssetId, name)
        {
        }

        private Report()
        {

        }
    }
}
