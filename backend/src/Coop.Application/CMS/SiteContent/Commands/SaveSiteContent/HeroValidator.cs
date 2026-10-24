using Coop.Application.CMS.Dtos;
using FluentValidation;

namespace Coop.Application.CMS.SiteContent.Commands.SaveSiteContent;

/// <summary>The welcome banner's rules (L2-REQ-096, L2-REQ-097, L2-REQ-098).</summary>
public class HeroValidator : AbstractValidator<HeroDto>
{
    public HeroValidator()
    {
        RuleFor(x => x.Eyebrow).ContentText();
        RuleFor(x => x.Title).RequiredText("Title");
        RuleFor(x => x.Lead).ContentText();
        RuleFor(x => x.Badge).ContentText();
        RuleFor(x => x.PrimaryAction).NotNull().SetValidator(new LinkValidator());
        RuleFor(x => x.SecondaryAction).NotNull().SetValidator(new LinkValidator());
        RuleFor(x => x.Photo).NotNull().SetValidator(new PhotoValidator());
    }
}
