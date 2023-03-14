using Coop.Domain.DomainEvents;
using Coop.Domain.DomainEvents.Document;
using System;

namespace Coop.Domain.Entities;

public class Document : AggregateRoot
{
    public Guid DocumentId { get; set; }
    public Guid? DigitalAssetId { get; protected set; }
    public string Body { get; protected set; }
    public string Name { get; protected set; }
    public DateTime? Published { get; protected set; }
    public Guid CreatedById { get; protected set; }
    public Document(CreateDocument @event)
    {
        Apply(@event);
    }
    protected Document()
    {
    }
    protected override void When(dynamic @event) => When(@event);
    protected override void EnsureValidState()
    {
    }
    private void When(Coop.Domain.DomainEvents.CreateDocument @event)
    {
        DocumentId = @event.DocumentId;
        Name = @event.Name;
        Body = @event.Body;
        DigitalAssetId = @event.DigitalAssetId;
        CreatedById = @event.CreatedById;
        Published = @event.Published;
    }
    private void When(Coop.Domain.DomainEvents.Document.PublishDocument @event)
    {
        Published = @event.Published;
    }
    private void When(Coop.Domain.DomainEvents.Document.DeleteDocument @event)
    {
    }
}
