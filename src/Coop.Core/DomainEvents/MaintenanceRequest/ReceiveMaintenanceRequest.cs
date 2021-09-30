namespace Coop.Core.DomainEvents
{
    public class ReceiveMaintenanceRequest: BaseDomainEvent
    {
        public string ReceivedByName { get; set; }
    }
}
