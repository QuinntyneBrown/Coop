using System;

namespace Coop.Core.DomainEvents.Document
{
    public class CreateDocument: BaseDomainEvent
    {
        public Guid DocumentId { get; private set; }
        public string Name { get; private set; }
        public string Body { get; private set; }        
        public Guid DigitalAssetId { get; set; }
        public Guid CreatedById { get; private set; }
        public CreateDocument(Guid documentId, string name, string body, Guid createdByUserId)
        {
            DocumentId = documentId;
            Name = name;
            Body = body;
            CreatedById = createdByUserId;
        }
    }
}
