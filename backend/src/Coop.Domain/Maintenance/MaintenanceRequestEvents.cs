using Coop.Domain.Common;

namespace Coop.Domain.Maintenance;

public class CreateMaintenanceRequest : BaseDomainEvent
{
    public Guid MaintenanceRequestId { get; set; }
    public Guid RequestedByProfileId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public UnitEntered UnitEntered { get; set; }
}

public class Receive : BaseDomainEvent
{
    public Guid MaintenanceRequestId { get; set; }
    public Guid ReceivedByProfileId { get; set; }
}

public class Start : BaseDomainEvent
{
    public Guid MaintenanceRequestId { get; set; }
    public Guid StartedByProfileId { get; set; }
}

public class Complete : BaseDomainEvent
{
    public Guid MaintenanceRequestId { get; set; }
    public Guid CompletedByProfileId { get; set; }
    public string WorkDetails { get; set; } = string.Empty;
}

public class UpdateDescription : BaseDomainEvent
{
    public Guid MaintenanceRequestId { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class UpdateWorkDetails : BaseDomainEvent
{
    public Guid MaintenanceRequestId { get; set; }
    public string WorkDetails { get; set; } = string.Empty;
}
