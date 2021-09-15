using MediatR;
using System;

namespace Coop.Api.Core
{
    public abstract class BaseDomainEvent : INotification
    {
        public DateTimeOffset DateOccurred { get; protected set; } = DateTime.UtcNow;
    }
}
