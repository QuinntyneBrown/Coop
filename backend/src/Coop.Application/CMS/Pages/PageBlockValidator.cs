using Coop.Application.CMS.Dtos;
using Coop.Application.CMS.SiteContent;
using FluentValidation;

namespace Coop.Application.CMS.Pages;

/// <summary>Each block by its kind (L2-REQ-123 AC3): text present and within length, a list with items, a described photo at a safe address, a safe link.</summary>
public class PageBlockValidator : AbstractValidator<PageBlockDto>
{
    public PageBlockValidator()
    {
        RuleFor(x => x).SetInheritanceValidator(block =>
        {
            block.Add(new InlineValidator<HeadingBlockDto> { v => v.RuleFor(b => b.Text).RequiredText("Heading") });
            block.Add(new InlineValidator<ParagraphBlockDto> { v => v.RuleFor(b => b.Text).RequiredText("Paragraph") });
            block.Add(new InlineValidator<BulletsBlockDto>
            {
                v => v.RuleFor(b => b.Items).NotEmpty().WithMessage("Write at least one item"),
                v => v.RuleForEach(b => b.Items).NotEmpty().MaximumLength(SiteContentRules.TextMaxLength),
            });
            block.Add(new InlineValidator<PhotoBlockDto> { v => v.RuleFor(b => b.Photo).NotNull().SetValidator(new PhotoValidator()) });
            block.Add(new InlineValidator<LinkBlockDto>
            {
                v => v.RuleFor(b => b.Label).NotEmpty().WithMessage("Fill in “Label”").MaximumLength(SiteContentRules.LinkLabelMaxLength),
                v => v.RuleFor(b => b.Href).NotEmpty().WithMessage("Fill in “Address”")
                    .MaximumLength(SiteContentRules.AddressMaxLength)
                    .Must(SiteContentRules.IsSafeLink).WithMessage(SiteContentRules.UnsafeLinkMessage),
            });
            block.Add(new InlineValidator<HtmlBlockDto> { v => v.RuleFor(b => b.Html).NotEmpty().WithMessage("Write something for the page") });
        });
    }
}
