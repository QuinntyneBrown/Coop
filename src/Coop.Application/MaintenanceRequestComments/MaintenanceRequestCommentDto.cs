using System;

namespace Coop.Application.Features;

 public class MaintenanceRequestCommentDto
 {
     public Guid MaintenanceRequestCommentId { get; set; }
     public Guid MaintenanceRequestId { get; private set; }
     public string Body { get; set; }
     public DateTime? Created { get; set; }
     public Guid? CreatedById { get; set; }
 }
