using Coop.Core.DomainEvents;
using System;

namespace Coop.Core.Models
{
    public class ByLaw : Document
    {
        public Guid ByLawId { get; private set; }

        public ByLaw(Coop.Core.DomainEvents.CreateDocument @event)
            : base(@event)
        {
        }

        private ByLaw()
        {

        }
    }
}
