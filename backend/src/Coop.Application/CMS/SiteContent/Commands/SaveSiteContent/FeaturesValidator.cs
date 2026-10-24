using Coop.Application.CMS.Dtos;
using FluentValidation;

namespace Coop.Application.CMS.SiteContent.Commands.SaveSiteContent;

/// <summary>The building and community rows: each needs a title, its lines and a described photo.</summary>
public class FeaturesValidator : AbstractValidator<FeaturesDto>
{
    public FeaturesValidator()
    {
        RuleFor(x => x.Rows).NotNull();
        RuleForEach(x => x.Rows).NotNull().ChildRules(row =>
        {
            row.RuleFor(r => r.Eyebrow).ContentText();
            row.RuleFor(r => r.Title).RequiredText("Title");
            row.RuleFor(r => r.Items).NotNull();
            row.RuleForEach(r => r.Items).NotEmpty().MaximumLength(SiteContentRules.TextMaxLength);
            row.RuleFor(r => r.Photo).NotNull().SetValidator(new PhotoValidator());
        });
    }
}
