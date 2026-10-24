using Coop.Application.CMS.Dtos;
using FluentValidation;

namespace Coop.Application.CMS.SiteContent.Commands.SaveSiteContent;

/// <summary>The "What's on" head and its empty message.</summary>
public class NoticesValidator : AbstractValidator<NoticesDto>
{
    public NoticesValidator()
    {
        RuleFor(x => x.Eyebrow).ContentText();
        RuleFor(x => x.Title).RequiredText("Title");
        RuleFor(x => x.Lead).ContentText();
        RuleFor(x => x.EmptyMessage).ContentText();
    }
}
