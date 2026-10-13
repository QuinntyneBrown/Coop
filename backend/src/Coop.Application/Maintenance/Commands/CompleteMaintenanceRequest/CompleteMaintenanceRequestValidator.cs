using Coop.Application.Common.Interfaces;
using Coop.Domain.Maintenance;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Commands.CompleteMaintenanceRequest;

public class CompleteMaintenanceRequestValidator : AbstractValidator<CompleteMaintenanceRequestRequest>
{
    public CompleteMaintenanceRequestValidator(ICoopDbContext context)
    {
        // A completed request passes so that re-posting Complete returns it (ADR 0004).
        RuleFor(x => x.MaintenanceRequestId)
            .MustAsync(async (id, cancellationToken) => !await context.MaintenanceRequests
                .AnyAsync(m => m.MaintenanceRequestId == id
                    && (m.Status == MaintenanceRequestStatus.New || m.Status == MaintenanceRequestStatus.Received), cancellationToken))
            .WithMessage("Only a started request can be finished.");
    }
}
