using Coop.Application.CMS.Dtos;
using FluentValidation;

namespace Coop.Application.CMS.SiteContent.Commands.SaveSiteContent;

/// <summary>The gallery: a title and photos with descriptions and a known size.</summary>
public class GalleryValidator : AbstractValidator<GalleryDto>
{
    private static readonly string[] Sizes = { "wide", "tall", "small" };

    public GalleryValidator()
    {
        RuleFor(x => x.Eyebrow).ContentText();
        RuleFor(x => x.Title).RequiredText("Title");
        RuleFor(x => x.Photos).NotNull();
        RuleForEach(x => x.Photos).NotNull().ChildRules(item =>
        {
            item.RuleFor(p => p.Photo).NotNull().SetValidator(new PhotoValidator());
            item.RuleFor(p => p.Caption).ContentText();
            item.RuleFor(p => p.Size).Must(size => Sizes.Contains(size));
        });
    }
}
