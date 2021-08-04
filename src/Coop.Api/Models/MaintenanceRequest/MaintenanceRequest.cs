using Coop.Api.DomainEvents;
using System;
using System.Collections.Generic;

namespace Coop.Api.Models
{
    public class MaintenanceRequest
    {
        public Guid MaintenanceRequestId { get; private set; }
        public List<MaintenanceRequestDomainEvent> Events { get; private set; } = new();
        public string Title { get; private set; }
        public string Description { get; private set; }
        public MaintenanceRequestStatus Status { get; private set; }

        public MaintenanceRequest(string title, string description)
        {
            Title = title;
            Description = description;
            Events.Add(new MaintenanceRequestCreatedEvent() { });
        }

        private MaintenanceRequest()
        {

        }
    }
}
