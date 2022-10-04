using System.Collections.Generic;

namespace Coop.Domain
{
    public interface IAggregateRoot
    {
        AggregateRoot Apply(IEvent @event);
    }
}