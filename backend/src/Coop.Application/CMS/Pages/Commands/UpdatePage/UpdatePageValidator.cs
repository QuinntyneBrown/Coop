using FluentValidation;

namespace Coop.Application.CMS.Pages.Commands.UpdatePage;

public class UpdatePageValidator : AbstractValidator<UpdatePageRequest>
{
    public UpdatePageValidator()
    {
        RuleFor(x => x.PageId).NotEmpty();
        RuleFor(x => x.Title).PageTitle();
        RuleFor(x => x.Body).PageBody();
        RuleFor(x => x.HeroImageUrl).PageHeroImageUrl();
    }
}
