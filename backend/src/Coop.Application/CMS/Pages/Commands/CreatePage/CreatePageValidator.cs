using FluentValidation;

namespace Coop.Application.CMS.Pages.Commands.CreatePage;

public class CreatePageValidator : AbstractValidator<CreatePageRequest>
{
    public CreatePageValidator()
    {
        RuleFor(x => x.Title).PageTitle();
        RuleForEach(x => x.Sections).PageBlock();
        RuleFor(x => x.HeroImageUrl).PageHeroImageUrl();
        RuleFor(x => x.HeroImageAlt).PageHeroImageAlt(x => x.HeroImageUrl);
    }
}
