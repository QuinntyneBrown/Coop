using System;
using System.ComponentModel.DataAnnotations;

namespace Coop.Api.Models
{
    public class ByLaw: Document
    {
        public Guid ByLawId { get; private set; }

        public ByLaw(Guid pdfDigitalAssetId, string name)
            :base(pdfDigitalAssetId, name)
        {
        }

        private ByLaw()
        {

        }
    }
}
