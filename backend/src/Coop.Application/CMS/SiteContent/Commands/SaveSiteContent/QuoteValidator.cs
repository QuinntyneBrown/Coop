using Coop.Application.CMS.Dtos;
using FluentValidation;

namespace Coop.Application.CMS.SiteContent.Commands.SaveSiteContent;

/// <summary>A member's words with a described photo.</summary>
public class QuoteValidator : AbstractValidator<QuoteDto>
{
    public QuoteValidator()
    {
        RuleFor(x => x.Text).RequiredText("Quotation");
        RuleFor(x => x.Attribution).ContentText();
        RuleFor(x => x.Photo).NotNull().SetValidator(new PhotoValidator());
    }
}
