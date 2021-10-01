using Coop.Core.DomainEvents;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Coop.Core.Models
{
    public class MaintenanceRequest: AggregateRoot
    {
        public Guid MaintenanceRequestId { get; private set; }
        [ForeignKey("RequestedByProfile")]
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
        public Profile RequestedByProfile { get; private set; }
        public MaintenanceRequestStatus Status { get; private set; } = MaintenanceRequestStatus.New;
        public List<MaintenanceRequestComment> Comments { get; private set; } = new();
        public List<MaintenanceRequestDigitalAsset> DigitalAssets { get; private set; } = new();

        public MaintenanceRequest(CreateMaintenanceRequest createMaintenanceRequest)
        {
            MaintenanceRequestId = createMaintenanceRequest.MaintenanceRequestId;
            RequestedByProfileId = createMaintenanceRequest.RequestedByProfileId;
            RequestedByName = createMaintenanceRequest.RequestedByName;
            Address = createMaintenanceRequest.Address;
            Phone = createMaintenanceRequest.Phone;
            Description = createMaintenanceRequest.Description;
            UnattendedUnitEntryAllowed = createMaintenanceRequest.UnattendedUnitEntryAllowed;
            Date = createMaintenanceRequest.Created;
        }

        public void When(UpdateMaintenanceRequestDescription updateMaintenanceRequestDescription)
        {
            Description = updateMaintenanceRequestDescription.Description;
        }

        public void When(UpdateMaintenanceRequest @event)
        {
            Address = @event.Address;
            Phone = @event.Phone;
            Description = @event.Description;
            UnattendedUnitEntryAllowed = @event.UnattendedUnitEntryAllowed;
        }

        public void When(ReceiveMaintenanceRequest @event)
        {
            ReceivedByName = @event.ReceivedByName;
            ReceivedByProfileId = @event.ReceivedByProfileId;
            Status = MaintenanceRequestStatus.Received;
        }

        public void When(StartMaintenanceRequest @event)
        {
            UnitEntered = @event.UnitEntered;
            WorkStarted = @event.WorkStarted;
            Status = MaintenanceRequestStatus.Started;
        }

        private MaintenanceRequest()
        {

        }

        protected override void EnsureValidState()
        {

        }

        protected override void When(dynamic @event) => this.When(@event);
    }
}
