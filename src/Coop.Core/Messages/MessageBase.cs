using System;

namespace Coop.Core.Messages
{
    public abstract class MessageBase
    {
        public Guid CorrelationId { get; set; } = Guid.NewGuid();
    }
}
