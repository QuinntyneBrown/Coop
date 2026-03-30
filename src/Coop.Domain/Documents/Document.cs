using Coop.Domain.Common;

namespace Coop.Domain.Documents;

public abstract class Document : AggregateRoot
{
    public Guid DocumentId { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public Guid? DigitalAssetId { get; set; }
    public DateTime? Published { get; set; }
    public Guid CreatedById { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public void Publish()
    {
        Published = DateTime.UtcNow;
    }

    public void SetName(string name)
    {
        Name = name;
    }

    public void SetBody(string body)
    {
        Body = body;
    }

    protected override void When(dynamic @event) { }

    public override void EnsureValidState()
    {
        if (DocumentId == Guid.Empty)
            throw new InvalidOperationException("DocumentId is required.");
    }
}
