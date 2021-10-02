namespace Coop.Core.DomainEvents
{
    public class UpdateMaintenanceRequestWorkDetails : BaseDomainEvent
    {
        public string WorkDetails { get; set; }
    }
}
