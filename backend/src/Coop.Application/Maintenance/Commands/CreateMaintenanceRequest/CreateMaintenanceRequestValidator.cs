using FluentValidation;

namespace Coop.Application.Maintenance.Commands.CreateMaintenanceRequest;

public class CreateMaintenanceRequestValidator : AbstractValidator<CreateMaintenanceRequestRequest>
{
    public CreateMaintenanceRequestValidator()
    {
        RuleFor(x => x.Description).NotEmpty();
        RuleFor(x => x.Phone).NotEmpty();
    }
}
