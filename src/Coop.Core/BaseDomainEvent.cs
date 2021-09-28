using MediatR;
using System;

namespace Coop.Core
{
    public abstract class BaseDomainEvent : INotification, IEvent
    {
        public DateTime Created { get; set; } = DateTime.UtcNow;
    }
}
