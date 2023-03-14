// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using Coop.Domain.Entities;

namespace Coop.Application.Features;

public static class MaintenanceRequestCommentExtensions
{
    public static MaintenanceRequestCommentDto ToDto(this MaintenanceRequestComment maintenanceRequestComment)
    {
        return new()
        {
            MaintenanceRequestCommentId = maintenanceRequestComment.MaintenanceRequestCommentId
        };
    }
}

