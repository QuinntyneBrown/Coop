using Coop.Core.DomainEvents;
using System;

namespace Coop.Core.Models
{
    public class Notice : Document
    {
        public Guid NoticeId { get; private set; }
        public Notice(CreateDocument @event)
            : base(@event)
        {
        }

        private Notice()
        {

        }
    }
}
