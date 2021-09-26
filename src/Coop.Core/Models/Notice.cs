using System;

namespace Coop.Core.Models
{
    public class Notice : Document
    {
        public Guid NoticeId { get; private set; }
        public string Body { get; private set; }
        public Notice(Guid pdfDigitalAssetId, string name)
            : base(pdfDigitalAssetId, name)
        { }

        public Notice(string name, string body, Guid createdById)
        {
            Name = name;
            Body = body;
            CreatedById = createdById;
        }

        private Notice()
        {

        }

        public void Update()
        {

        }
    }
}
