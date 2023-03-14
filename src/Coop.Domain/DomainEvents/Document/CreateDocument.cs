using System;

namespace Coop.Domain.DomainEvents;

public class CreateDocument : BaseDomainEvent
{
    public Guid DocumentId { get; private set; } = Guid.NewGuid();
    public string Name { get; private set; }
    public string Body { get; private set; }
    public Guid DigitalAssetId { get; set; }
    public Guid CreatedById { get; private set; }
    public DateTime Published { get; set; } = DateTime.UtcNow;
    public CreateDocument(Guid documentId, string name, Guid digitalAssetId, Guid createdByUserId)
    {
        DocumentId = documentId;
        Name = name;
        DigitalAssetId = digitalAssetId;
        CreatedById = createdByUserId;
    }
}
