using Coop.Domain.DomainEvents;
using System;

namespace Coop.Domain.Entities;

public class Report : Document
{
    public Guid ReportId { get; set; }
    public Report(Coop.Domain.DomainEvents.CreateDocument @event)
        : base(@event)
    {
    }
    private Report()
    {
    }
}
