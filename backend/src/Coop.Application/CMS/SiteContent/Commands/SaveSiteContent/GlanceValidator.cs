using Coop.Application.CMS.Dtos;
using FluentValidation;

namespace Coop.Application.CMS.SiteContent.Commands.SaveSiteContent;

/// <summary>The figures at a glance: each needs its number and what it counts.</summary>
public class GlanceValidator : AbstractValidator<GlanceDto>
{
    public GlanceValidator()
    {
        RuleFor(x => x.Figures).NotNull();
        RuleForEach(x => x.Figures).NotNull().ChildRules(figure =>
        {
            figure.RuleFor(f => f.Value).RequiredText("Figure");
            figure.RuleFor(f => f.Label).RequiredText("Label");
        });
    }
}
