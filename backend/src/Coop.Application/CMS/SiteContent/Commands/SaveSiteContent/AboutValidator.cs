using Coop.Application.CMS.Dtos;
using FluentValidation;

namespace Coop.Application.CMS.SiteContent.Commands.SaveSiteContent;

/// <summary>The "Who we are" section: a title and value cards with a known picture.</summary>
public class AboutValidator : AbstractValidator<AboutDto>
{
    private static readonly string[] Icons = { "members", "affordable", "company" };

    public AboutValidator()
    {
        RuleFor(x => x.Eyebrow).ContentText();
        RuleFor(x => x.Title).RequiredText("Title");
        RuleFor(x => x.Lead).ContentText();
        RuleFor(x => x.Values).NotNull();
        RuleForEach(x => x.Values).NotNull().ChildRules(value =>
        {
            value.RuleFor(v => v.Icon).Must(icon => Icons.Contains(icon));
            value.RuleFor(v => v.Title).RequiredText("Title");
            value.RuleFor(v => v.Text).ContentText();
        });
    }
}
