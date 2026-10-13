namespace Coop.Domain.Maintenance;

public class MaintenanceRequestComment
{
    public Guid MaintenanceRequestCommentId { get; set; } = Guid.NewGuid();
    public Guid MaintenanceRequestId { get; set; }
    public Guid CreatedByProfileId { get; set; }
    public string Body { get; set; } = string.Empty;
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public bool IsDeleted { get; set; }

    public void Delete()
    {
        IsDeleted = true;
    }
}
