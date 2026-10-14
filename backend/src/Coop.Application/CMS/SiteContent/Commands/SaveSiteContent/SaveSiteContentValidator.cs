using Coop.Application.CMS.Dtos;
using FluentValidation;

namespace Coop.Application.CMS.SiteContent.Commands.SaveSiteContent;

/// <summary>
/// Rules for every block of the site content (L2-REQ-093 to L2-REQ-097):
/// required values, safe links, photo descriptions and length limits.
/// </summary>
public class SaveSiteContentValidator : AbstractValidator<SaveSiteContentRequest>
{
    private static readonly string[] Icons = { "members", "affordable", "company" };
    private static readonly string[] Sizes = { "wide", "tall", "small" };

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
            home.RuleFor(h => h.Hero).NotNull().ChildRules(hero =>
            {
                hero.RuleFor(x => x.Eyebrow).ContentText();
                hero.RuleFor(x => x.Title).RequiredText("Title");
                hero.RuleFor(x => x.Lead).ContentText();
                hero.RuleFor(x => x.Badge).ContentText();
                hero.RuleFor(x => x.PrimaryAction).NotNull().SetValidator(link);
                hero.RuleFor(x => x.SecondaryAction).NotNull().SetValidator(link);
                hero.RuleFor(x => x.Photo).NotNull().SetValidator(photo);
            });
            home.RuleFor(h => h.Glance).NotNull().ChildRules(glance =>
            {
                glance.RuleFor(x => x.Figures).NotNull();
                glance.RuleForEach(x => x.Figures).NotNull().ChildRules(figure =>
                {
                    figure.RuleFor(f => f.Value).RequiredText("Figure");
                    figure.RuleFor(f => f.Label).RequiredText("Label");
                });
            });
            home.RuleFor(h => h.About).NotNull().ChildRules(about =>
            {
                about.RuleFor(x => x.Eyebrow).ContentText();
                about.RuleFor(x => x.Title).RequiredText("Title");
                about.RuleFor(x => x.Lead).ContentText();
                about.RuleFor(x => x.Values).NotNull();
                about.RuleForEach(x => x.Values).NotNull().ChildRules(value =>
                {
                    value.RuleFor(v => v.Icon).Must(icon => Icons.Contains(icon));
                    value.RuleFor(v => v.Title).RequiredText("Title");
                    value.RuleFor(v => v.Text).ContentText();
                });
            });
            home.RuleFor(h => h.Gallery).NotNull().ChildRules(gallery =>
            {
                gallery.RuleFor(x => x.Eyebrow).ContentText();
                gallery.RuleFor(x => x.Title).RequiredText("Title");
                gallery.RuleFor(x => x.Photos).NotNull();
                gallery.RuleForEach(x => x.Photos).NotNull().ChildRules(item =>
                {
                    item.RuleFor(p => p.Photo).NotNull().SetValidator(photo);
                    item.RuleFor(p => p.Caption).ContentText();
                    item.RuleFor(p => p.Size).Must(size => Sizes.Contains(size));
                });
            });
            home.RuleFor(h => h.Features).NotNull().ChildRules(features =>
            {
                features.RuleFor(x => x.Rows).NotNull();
                features.RuleForEach(x => x.Rows).NotNull().ChildRules(row =>
                {
                    row.RuleFor(r => r.Eyebrow).ContentText();
                    row.RuleFor(r => r.Title).RequiredText("Title");
                    row.RuleFor(r => r.Items).NotNull();
                    row.RuleForEach(r => r.Items).NotEmpty().MaximumLength(SiteContentRules.TextMaxLength);
                    row.RuleFor(r => r.Photo).NotNull().SetValidator(photo);
                });
            });
            home.RuleFor(h => h.Notices).NotNull().ChildRules(notices =>
            {
                notices.RuleFor(x => x.Eyebrow).ContentText();
                notices.RuleFor(x => x.Title).RequiredText("Title");
                notices.RuleFor(x => x.Lead).ContentText();
                notices.RuleFor(x => x.EmptyMessage).ContentText();
            });
            home.RuleFor(h => h.Board).NotNull().ChildRules(board =>
            {
                board.RuleFor(x => x.Eyebrow).ContentText();
                board.RuleFor(x => x.Title).RequiredText("Title");
            });
            home.RuleFor(h => h.Quote).NotNull().ChildRules(quote =>
            {
                quote.RuleFor(x => x.Text).RequiredText("Quotation");
                quote.RuleFor(x => x.Attribution).ContentText();
                quote.RuleFor(x => x.Photo).NotNull().SetValidator(photo);
            });
            home.RuleFor(h => h.Visit).NotNull().ChildRules(visit =>
            {
                visit.RuleFor(x => x.Eyebrow).ContentText();
                visit.RuleFor(x => x.Title).RequiredText("Title");
                visit.RuleFor(x => x.Lead).ContentText();
                visit.RuleFor(x => x.Phone).ContentText();
                visit.RuleFor(x => x.Hours).ContentText();
                visit.RuleFor(x => x.Action).NotNull().SetValidator(link);
            });
        }).When(x => x.SiteContent is not null);
    }
}
