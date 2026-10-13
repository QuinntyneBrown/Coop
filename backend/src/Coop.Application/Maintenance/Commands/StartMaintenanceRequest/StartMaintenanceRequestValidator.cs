using Coop.Application.Common.Interfaces;
using Coop.Domain.Maintenance;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Commands.StartMaintenanceRequest;

public class StartMaintenanceRequestValidator : AbstractValidator<StartMaintenanceRequestRequest>
{
    public StartMaintenanceRequestValidator(ICoopDbContext context)
    {
        // A started or completed request passes so that re-posting Start returns it (ADR 0004).
        RuleFor(x => x.MaintenanceRequestId)
            .MustAsync(async (id, cancellationToken) => !await context.MaintenanceRequests
                .AnyAsync(m => m.MaintenanceRequestId == id && m.Status == MaintenanceRequestStatus.New, cancellationToken))
            .WithMessage("Only a received request can be started.");
    }
}
