using Coop.Core.DomainEvents.Document;
using System;

namespace Coop.Core.Models
{
    public class Report : Document
    {
        public Guid ReportId { get; set; }

        public Report(CreateDocument @event)
            : base(@event)
        {
        }

        private Report()
        {

        }
    }
}
