using Coop.Core.Models;
using System;

namespace Coop.Core.DomainEvents
{
    public class StartMaintenanceRequest: BaseDomainEvent
    {
        public UnitEntered UnitEntered { get; set; }
        public DateTime WorkStarted { get; set; }
    }
}
