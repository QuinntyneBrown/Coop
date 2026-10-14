using Coop.Application.CMS.Dtos;
using FluentValidation;

namespace Coop.Application.CMS.SiteContent;

/// <summary>A photo needs a safe address, a description and its size (L2-REQ-097).</summary>
public class PhotoValidator : AbstractValidator<PhotoDto>
{
    public PhotoValidator()
    {
        RuleFor(x => x.Src).NotEmpty().MaximumLength(SiteContentRules.AddressMaxLength)
            .Must(SiteContentRules.IsSafeImageAddress).WithMessage(SiteContentRules.UnsafePhotoMessage);
        RuleFor(x => x.Alt).NotEmpty().WithMessage(SiteContentRules.MissingPhotoDescriptionMessage)
            .MaximumLength(SiteContentRules.PhotoDescriptionMaxLength).WithMessage(SiteContentRules.LongPhotoDescriptionMessage);
        RuleFor(x => x.Width).InclusiveBetween(1, SiteContentRules.PhotoSizeMax);
        RuleFor(x => x.Height).InclusiveBetween(1, SiteContentRules.PhotoSizeMax);
    }
}
