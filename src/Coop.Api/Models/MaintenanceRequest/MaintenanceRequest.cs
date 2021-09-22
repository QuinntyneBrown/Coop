using System;
using System.Collections.Generic;

namespace Coop.Api.Models
{
    public class MaintenanceRequest
    {
        public Guid MaintenanceRequestId { get; private set; }
        public string Title { get; private set; }
        public string Description { get; private set; }
        public MaintenanceRequestStatus Status { get; private set; } = MaintenanceRequestStatus.New;
        public List<MaintenanceRequestComment> Comments { get; private set; } = new();
        public List<MaintenanceRequestDigitalAsset> DigitalAssets { get; private set; } = new();
        public Guid CreatedById { get; private set; }
        public MaintenanceRequest(string title, string description, Guid createdById)
        {
            Title = title;
            Description = description;
            CreatedById = createdById;
        }

        private MaintenanceRequest()
        {

        }
    }
}
