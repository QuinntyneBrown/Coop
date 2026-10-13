using Coop.Domain.EventSourcing;

namespace Coop.Application.EventSourcing.Dtos;

public class StoredEventDto
{
    public Guid StoredEventId { get; set; }
    public string StreamId { get; set; } = string.Empty;
    public string Aggregate { get; set; } = string.Empty;
    public string Data { get; set; } = string.Empty;
    public DateTime CreatedOn { get; set; }
    public int Version { get; set; }
    public long Sequence { get; set; }
    public Guid CorrelationId { get; set; }

    public static StoredEventDto FromStoredEvent(StoredEvent se)
    {
        return new StoredEventDto
        {
            StoredEventId = se.StoredEventId,
            StreamId = se.StreamId,
            Aggregate = se.Aggregate,
            Data = se.Data,
            CreatedOn = se.CreatedOn,
            Version = se.Version,
            Sequence = se.Sequence,
            CorrelationId = se.CorrelationId
        };
    }
}
