using Coop.Application.CMS.Dtos;
using FluentValidation;

namespace Coop.Application.CMS.SiteContent.Commands.SaveSiteContent;

/// <summary>
/// Rules for every section of the site content (L2-REQ-095 to L2-REQ-099,
/// L2-REQ-122 AC6): required values, safe links, photo descriptions and
/// length limits, each home section by its kind and each kind at most once.
/// </summary>
public class SaveSiteContentValidator : AbstractValidator<SaveSiteContentRequest>
{
    public SaveSiteContentValidator()
    {
        var link = new LinkValidator();
        var photo = new PhotoValidator();

        RuleFor(x => x.SiteContent).NotNull();
        RuleFor(x => x.SiteContent.Header).NotNull().ChildRules(header =>
        {
            header.RuleFor(h => h.SiteName).RequiredText("Site name");
            header.RuleFor(h => h.SiteSubtitle).ContentText();
            header.RuleFor(h => h.MenuLinks).NotNull();
            header.RuleForEach(h => h.MenuLinks).NotNull().SetValidator(link);
            header.RuleFor(h => h.SignInLink).NotNull().SetValidator(link);
            header.RuleFor(h => h.VisitLink).NotNull().SetValidator(link);
        }).When(x => x.SiteContent is not null);

        RuleFor(x => x.SiteContent.Footer).NotNull().ChildRules(footer =>
        {
            footer.RuleFor(f => f.ContactHeading).ContentText();
            footer.RuleFor(f => f.Organisation).ContentText();
            footer.RuleFor(f => f.Area).ContentText();
            footer.RuleFor(f => f.Phone).ContentText();
            footer.RuleFor(f => f.Email).ContentText();
            footer.RuleFor(f => f.SiteLinksHeading).ContentText();
            footer.RuleFor(f => f.SiteLinks).NotNull();
            footer.RuleForEach(f => f.SiteLinks).NotNull().SetValidator(link);
            footer.RuleFor(f => f.MemberLinksHeading).ContentText();
            footer.RuleFor(f => f.MemberLinks).NotNull();
            footer.RuleForEach(f => f.MemberLinks).NotNull().SetValidator(link);
            footer.RuleFor(f => f.Copyright).ContentText();
            footer.RuleFor(f => f.WebsiteLine).ContentText();
        }).When(x => x.SiteContent is not null);

        RuleFor(x => x.SiteContent.Home).NotNull().ChildRules(home =>
        {
            home.RuleFor(h => h.Sections).NotNull()
                .Must(sections => sections.All(section => section is not null))
                .WithMessage("Every section needs a kind.")
                .Must(sections => sections.Where(section => section is not null).Select(section => section.GetType()).Distinct().Count() == sections.Count(section => section is not null))
                .WithMessage(SiteContentRules.RepeatedSectionMessage);
            home.RuleForEach(h => h.Sections).SetInheritanceValidator(section =>
            {
                section.Add(new HeroValidator());
                section.Add(new GlanceValidator());
                section.Add(new AboutValidator());
                section.Add(new GalleryValidator());
                section.Add(new FeaturesValidator());
                section.Add(new NoticesValidator());
                section.Add(new BoardValidator());
                section.Add(new QuoteValidator());
                section.Add(new VisitValidator());
            });
        }).When(x => x.SiteContent is not null);
    }
}
