
namespace Coop.Domain.DomainEvents;

public class UpdateMaintenanceRequestWorkDetails : BaseDomainEvent
{
    public string WorkDetails { get; set; }
}
