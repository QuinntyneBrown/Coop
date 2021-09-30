namespace Coop.Core.DomainEvents
{
    public class UpdateMaintenanceRequestDescription: BaseDomainEvent
    {
        public string Description { get; set; }
    }
}
