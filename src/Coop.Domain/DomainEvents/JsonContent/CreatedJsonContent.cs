using System;

namespace Coop.Domain.DomainEvents;

 public class CreatedJsonContent : BaseDomainEvent
 {
     public Guid JsonContentId { get; set; }
     public string Name { get; set; }
 }
