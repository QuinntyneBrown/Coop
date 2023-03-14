using Coop.Domain.Entities;
using System;

namespace Coop.Domain.DomainEvents;

public class StartMaintenanceRequest : BaseDomainEvent
{
    public UnitEntered UnitEntered { get; set; }
    public DateTime WorkStarted { get; set; }
}
