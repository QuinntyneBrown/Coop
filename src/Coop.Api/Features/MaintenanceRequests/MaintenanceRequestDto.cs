using System;

namespace Coop.Api.Features
{
    public class MaintenanceRequestDto
    {
        public Guid CreatedById { get; set; }
        public Guid MaintenanceRequestId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
    }
}
