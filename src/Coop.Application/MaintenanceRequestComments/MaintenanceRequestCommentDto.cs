// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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

