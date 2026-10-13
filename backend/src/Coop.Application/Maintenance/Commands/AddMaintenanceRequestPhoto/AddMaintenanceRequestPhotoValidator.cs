using FluentValidation;

namespace Coop.Application.Maintenance.Commands.AddMaintenanceRequestPhoto;

public class AddMaintenanceRequestPhotoValidator : AbstractValidator<AddMaintenanceRequestPhotoRequest>
{
    public const long MaxBytes = 10 * 1024 * 1024;

    public static readonly string[] ContentTypes = { "image/jpeg", "image/png", "image/webp" };

    public AddMaintenanceRequestPhotoValidator()
    {
        RuleFor(x => x.File).NotNull().WithMessage("Choose a photo.");
        RuleFor(x => x.File.ContentType)
            .Must(type => ContentTypes.Contains(type))
            .When(x => x.File is not null)
            .WithMessage("Choose a JPEG, PNG or WebP photo.");
        RuleFor(x => x.File.Length)
            .InclusiveBetween(1, MaxBytes)
            .When(x => x.File is not null)
            .WithMessage("Choose a photo smaller than 10 MB.");
    }
}
