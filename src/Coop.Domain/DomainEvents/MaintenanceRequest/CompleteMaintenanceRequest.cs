using System;

namespace Coop.Domain.DomainEvents;

public class CompleteMaintenanceRequest : BaseDomainEvent
{
    public string WorkCompletedByName { get; set; }
    public DateTime WorkCompleted { get; set; }
}
