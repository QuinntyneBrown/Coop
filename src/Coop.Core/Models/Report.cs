using Coop.Core.DomainEvents;
using System;

namespace Coop.Core.Models
{
    public class Report : Document
    {
        public Guid ReportId { get; set; }

        public Report(Coop.Core.DomainEvents.CreateDocument @event)
            : base(@event)
        {
        }

        private Report()
        {

        }
    }
}
