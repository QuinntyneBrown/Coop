using Coop.Core.DomainEvents;
using System;

namespace Coop.Core.Models
{
    public class Notice : Document
    {
        public Guid NoticeId { get; private set; }
        public Notice(Coop.Core.DomainEvents.CreateDocument @event)
            : base(@event)
        {
        }

        private Notice()
        {

        }
    }
}
