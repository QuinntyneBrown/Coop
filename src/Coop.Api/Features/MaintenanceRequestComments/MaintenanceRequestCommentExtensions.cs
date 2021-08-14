using System;
using Coop.Api.Models;

namespace Coop.Api.Features
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
