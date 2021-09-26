using Coop.Core.DomainEvents;
using System;
using System.Collections.Generic;

namespace Coop.Core.Models
{
    public class MaintenanceRequest: AggregateRoot
    {
        public Guid MaintenanceRequestId { get; private set; }
        public string MemberName { get; set; }
        public DateTime Date { get; set; }
        public Address Address { get; set; }
        public string Phone { get; set; }
        public string Description { get; set; }
        public bool UnitEntry { get; set; }
        public Guid ReceivedById { get; set; }
        public DateTime? ReceivedDate { get; set; }
        public string WorkDetails { get; set; }
        public DateTime WorkStarted { get; set; }
        public DateTime WorkCompleted { get; set; }
        public DateTime WorkCompletedById { get; set; }
        public UnitEntered UnitEntered { get; private set; }
        public MaintenanceRequestStatus Status { get; private set; } = MaintenanceRequestStatus.New;
        public List<MaintenanceRequestComment> Comments { get; private set; } = new();
        public List<MaintenanceRequestDigitalAsset> DigitalAssets { get; private set; } = new();

        public MaintenanceRequest(CreateMaintenanceRequest createMaintenanceRequest)
        {

        }

        private MaintenanceRequest()
        {

        }

        protected override void When(dynamic @event)
        {

        }

        protected override void EnsureValidState()
        {

        }
    }
}
