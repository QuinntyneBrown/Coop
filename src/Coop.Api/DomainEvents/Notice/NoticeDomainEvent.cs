using MediatR;
using System;

namespace Coop.Api.DomainEvents
{
    public class NoticeDomainEvent : INotification
    {
        public Guid NoticeDomainEventId { get; private set; }
        public Guid NoticeId { get; private set; }
        public DateTime Created { get; private set; } = DateTime.UtcNow;
    }
}
