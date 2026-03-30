using Coop.Domain.Maintenance;

namespace Coop.Application.Maintenance.Dtos;

public class MaintenanceRequestCommentDto
{
    public Guid MaintenanceRequestCommentId { get; set; }
    public Guid MaintenanceRequestId { get; set; }
    public Guid CreatedByProfileId { get; set; }
    public string Body { get; set; } = string.Empty;
    public DateTime CreatedOn { get; set; }

    public static MaintenanceRequestCommentDto FromComment(MaintenanceRequestComment c)
    {
        return new MaintenanceRequestCommentDto
        {
            MaintenanceRequestCommentId = c.MaintenanceRequestCommentId,
            MaintenanceRequestId = c.MaintenanceRequestId,
            CreatedByProfileId = c.CreatedByProfileId,
            Body = c.Body,
            CreatedOn = c.CreatedOn
        };
    }
}
