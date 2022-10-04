using Coop.Domain.DomainEvents;
using System;

namespace Coop.Domain.Entities
{
    public class ByLaw : Document
    {
        public Guid ByLawId { get; private set; }

        public ByLaw(Coop.Domain.DomainEvents.CreateDocument @event)
            : base(@event)
        {
        }

        private ByLaw()
        {

        }
    }
}
