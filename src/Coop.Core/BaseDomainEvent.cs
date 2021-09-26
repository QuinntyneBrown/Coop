using MediatR;
using System;

namespace Coop.Core
{
    public abstract class BaseDomainEvent : INotification
    {
        public DateTimeOffset DateOccurred { get; protected set; } = DateTime.UtcNow;
    }
}
