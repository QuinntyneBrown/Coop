using System.Collections.Generic;

namespace Coop.Core
{
    public interface IAggregateRoot
    {
        AggregateRoot Apply(IEvent @event);
    }
}