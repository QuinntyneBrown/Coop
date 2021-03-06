using System;
using Coop.Core.Models;

namespace Coop.Api.Features
{
    public static class StoredEventExtensions
    {
        public static StoredEventDto ToDto(this StoredEvent storedEvent)
        {
            return new()
            {
                StoredEventId = storedEvent.StoredEventId
            };
        }

    }
}
