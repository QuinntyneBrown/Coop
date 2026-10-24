using FluentValidation;

namespace Coop.Application.CMS.Pages.Commands.UpdatePage;

public class UpdatePageValidator : AbstractValidator<UpdatePageRequest>
{
    public UpdatePageValidator()
    {
        RuleFor(x => x.PageId).NotEmpty();
        RuleFor(x => x.Title).PageTitle();
        RuleForEach(x => x.Sections).PageBlock();
        RuleFor(x => x.HeroImageUrl).PageHeroImageUrl();
        RuleFor(x => x.HeroImageAlt).PageHeroImageAlt(x => x.HeroImageUrl);
    }
}
