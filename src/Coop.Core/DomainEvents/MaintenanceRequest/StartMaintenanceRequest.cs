using Coop.Core.Models;
using System;

namespace Coop.Core.DomainEvents
{
    public class StartMaintenanceRequest: EventBase
    {
        public UnitEntered UnitEntered { get; set; }
        public DateTime WorkStarted { get; set; }
    }
}
