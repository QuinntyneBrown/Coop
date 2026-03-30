namespace Coop.Domain.Maintenance;

public class MaintenanceRequestComment
{
    public Guid MaintenanceRequestCommentId { get; set; } = Guid.NewGuid();
    public Guid MaintenanceRequestId { get; set; }
    public string Body { get; set; } = string.Empty;
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public Guid CreatedById { get; set; }
}
