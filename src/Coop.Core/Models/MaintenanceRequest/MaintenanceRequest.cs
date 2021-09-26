using Coop.Core.DomainEvents;
using System;
using System.Collections.Generic;

namespace Coop.Core.Models
{
    public class MaintenanceRequest: AggregateRoot
    {
        public Guid MaintenanceRequestId { get; private set; }
        public Guid RequestedByProfileId { get; private set; }
        public string RequestedByName { get; set; }
        public DateTime Date { get; set; }
        public Address Address { get; set; }
        public string Phone { get; set; }
        public string Description { get; set; }
        public bool UnattendedUnitEntryAllowed { get; set; }
        public Guid ReceivedByProfileId { get; set; }
        public string ReceivedByName { get; set; }
        public DateTime? ReceivedDate { get; set; }
        public string WorkDetails { get; set; }
        public DateTime WorkStarted { get; set; }
        public DateTime WorkCompleted { get; set; }
        public string WorkCompletedByName { get; set; }
        public UnitEntered UnitEntered { get; private set; }
        public MaintenanceRequestStatus Status { get; private set; } = MaintenanceRequestStatus.New;
        public List<MaintenanceRequestComment> Comments { get; private set; } = new();
        public List<MaintenanceRequestDigitalAsset> DigitalAssets { get; private set; } = new();

        public MaintenanceRequest(CreateMaintenanceRequest createMaintenanceRequest)
        {
            var address = Address.Create(
                createMaintenanceRequest.Address.Street,
                createMaintenanceRequest.Address.Unit,
                createMaintenanceRequest.Address.City,
                createMaintenanceRequest.Address.Province,
                createMaintenanceRequest.Address.PostalCode)
                .Value;
            
            MaintenanceRequestId = createMaintenanceRequest.MaintenanceRequestId;
            RequestedByProfileId = createMaintenanceRequest.RequestedByProfileId;
            RequestedByName = createMaintenanceRequest.RequestedByName;
            Address = address;
            Phone = createMaintenanceRequest.Phone;
            Description = createMaintenanceRequest.Description;
            UnattendedUnitEntryAllowed = createMaintenanceRequest.UnattendedUnitEntryAllowed;
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
