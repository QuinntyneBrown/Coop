// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Maintenance.Domain.Entities;

public class MaintenanceRequestComment
{
    public Guid MaintenanceRequestCommentId { get; private set; } = Guid.NewGuid();
    public Guid MaintenanceRequestId { get; private set; }
    public Guid CreatedByProfileId { get; private set; }
    public string Body { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; private set; }

    private MaintenanceRequestComment() { }

    public MaintenanceRequestComment(Guid maintenanceRequestId, Guid createdByProfileId, string body)
    {
        MaintenanceRequestId = maintenanceRequestId;
        CreatedByProfileId = createdByProfileId;
        Body = body;
    }

    public void UpdateBody(string body)
    {
        Body = body;
        UpdatedAt = DateTime.UtcNow;
    }
}
