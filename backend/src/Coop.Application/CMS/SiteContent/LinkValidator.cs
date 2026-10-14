using Coop.Application.CMS.Dtos;
using FluentValidation;

namespace Coop.Application.CMS.SiteContent;

/// <summary>A link needs a label and a safe address (L2-REQ-098).</summary>
public class LinkValidator : AbstractValidator<LinkDto>
{
    public LinkValidator()
    {
        RuleFor(x => x.Label).NotEmpty().WithMessage("Fill in “Label”").MaximumLength(SiteContentRules.LinkLabelMaxLength);
        RuleFor(x => x.Href).NotEmpty().WithMessage("Fill in “Address”")
            .MaximumLength(SiteContentRules.AddressMaxLength)
            .Must(SiteContentRules.IsSafeLink).WithMessage(SiteContentRules.UnsafeLinkMessage);
    }
}
