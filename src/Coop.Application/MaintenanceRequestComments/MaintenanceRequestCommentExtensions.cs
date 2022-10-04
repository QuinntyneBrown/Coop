using System;
using Coop.Domain.Entities;

namespace Coop.Application.Features
{
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
}
