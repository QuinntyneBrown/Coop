// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore;
using System;

namespace Coop.Domain.Entities;

[Owned]
public class MaintenanceRequestComment
{
    public Guid MaintenanceRequestCommentId { get; set; }
    public Guid MaintenanceRequestId { get; private set; }
    public string Body { get; private set; }
    public DateTime Created { get; private set; } = DateTime.UtcNow;
    public Guid CreatedById { get; private set; }
    public MaintenanceRequestComment(Guid maintenanceRequestId, string body, Guid createdById)
    {
        MaintenanceRequestId = maintenanceRequestId;
        Body = body;
        CreatedById = createdById;
    }
    private MaintenanceRequestComment()
    {
    }
}

