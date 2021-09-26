namespace Coop.Core.DomainEvents
{
    public class UpdateMaintenanceRequestWorkDetails: EventBase
    {
        public string WorkDetails { get; set; }
    }
}
