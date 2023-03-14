using System;
using Coop.Domain.Entities;

namespace Coop.Application.Features;

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
