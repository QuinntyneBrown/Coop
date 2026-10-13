using Coop.Domain.CMS;
using FluentValidation;

namespace Coop.Application.CMS.Pages;

/// <summary>Validation rules shared by the create and update page requests (L2-REQ-080 AC13).</summary>
public static class PageRules
{
    public const string DuplicateTitleMessage = "A page with this title already exists.";

    public static IRuleBuilderOptions<T, string> PageTitle<T>(this IRuleBuilder<T, string> rule)
        => rule.NotEmpty().WithMessage("Give the page a title")
            .MaximumLength(120)
            .Must(title => Page.SlugFrom(title ?? string.Empty).Length > 0)
            .WithMessage("The title needs at least one letter or number.");

    public static IRuleBuilderOptions<T, string> PageBody<T>(this IRuleBuilder<T, string> rule)
        => rule.NotEmpty().WithMessage("Write something for the page");

    public static IRuleBuilderOptions<T, string?> PageHeroImageUrl<T>(this IRuleBuilder<T, string?> rule)
        => rule.MaximumLength(2048);
}
