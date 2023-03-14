using System;

namespace Coop.Domain.DomainEvents;

 public class CreatedProfile : BaseDomainEvent
 {
     public Guid UserId { get; set; }
     public Guid ProfileId { get; set; }
 }
