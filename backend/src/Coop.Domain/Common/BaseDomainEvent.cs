namespace Coop.Domain.Common;

public abstract class BaseDomainEvent : IEvent
{
    public DateTime Created { get; } = DateTime.UtcNow;
    public Guid CorrelationId { get; } = Guid.NewGuid();
}
