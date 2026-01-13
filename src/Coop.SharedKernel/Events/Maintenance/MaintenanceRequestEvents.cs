// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MessagePack;

namespace Coop.SharedKernel.Events.Maintenance;

[MessagePackObject]
public class MaintenanceRequestCreatedEvent : IntegrationEvent
{
    [Key(4)]
    public Guid MaintenanceRequestId { get; set; }

    [Key(5)]
    public Guid RequestedByProfileId { get; set; }

    [Key(6)]
    public string Description { get; set; } = string.Empty;

    [Key(7)]
    public string Status { get; set; } = string.Empty;
}

[MessagePackObject]
public class MaintenanceRequestStatusChangedEvent : IntegrationEvent
{
    [Key(4)]
    public Guid MaintenanceRequestId { get; set; }

    [Key(5)]
    public string OldStatus { get; set; } = string.Empty;

    [Key(6)]
    public string NewStatus { get; set; } = string.Empty;

    [Key(7)]
    public Guid? AssignedToProfileId { get; set; }
}

[MessagePackObject]
public class MaintenanceRequestCommentAddedEvent : IntegrationEvent
{
    [Key(4)]
    public Guid MaintenanceRequestId { get; set; }

    [Key(5)]
    public Guid CommentId { get; set; }

    [Key(6)]
    public Guid CreatedByProfileId { get; set; }

    [Key(7)]
    public string Body { get; set; } = string.Empty;
}
