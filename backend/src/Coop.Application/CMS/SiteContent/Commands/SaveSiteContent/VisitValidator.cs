using Coop.Application.CMS.Dtos;
using FluentValidation;

namespace Coop.Application.CMS.SiteContent.Commands.SaveSiteContent;

/// <summary>The "Visit or apply" band with its safe link.</summary>
public class VisitValidator : AbstractValidator<VisitDto>
{
    public VisitValidator()
    {
        RuleFor(x => x.Eyebrow).ContentText();
        RuleFor(x => x.Title).RequiredText("Title");
        RuleFor(x => x.Lead).ContentText();
        RuleFor(x => x.Phone).ContentText();
        RuleFor(x => x.Hours).ContentText();
        RuleFor(x => x.Action).NotNull().SetValidator(new LinkValidator());
    }
}
