namespace Coop.Domain.EventSourcing;

public class StoredEvent
{
    public Guid StoredEventId { get; set; } = Guid.NewGuid();
    public string StreamId { get; set; } = string.Empty;
    public string Aggregate { get; set; } = string.Empty;
    public string Data { get; set; } = string.Empty;
    public DateTime CreatedOn { get; set; }
    public int Version { get; set; }
    public long Sequence { get; set; }
    public Guid CorrelationId { get; set; }
}
