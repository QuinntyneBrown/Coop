
namespace Coop.Domain.DomainEvents;

public class UpdateMaintenanceRequestDescription : BaseDomainEvent
{
    public string Description { get; set; }
}
