using Coop.Application.CMS.Dtos;

namespace Coop.Infrastructure.Persistence.Seeding;

/// <summary>
/// The site content a fresh installation publishes (L2-REQ-100 AC1): every
/// value the public site shows, matching the public application's built-in
/// defaults. Photographs are the public application's own files under
/// <c>/own/</c> unless <paramref name="photoAddress"/> maps a file name such
/// as <c>hero.svg</c> to another address, as the demo reset does for its
/// digital assets. People, places and contact details are fictional.
/// </summary>
public static class SiteContentSeed
{
    public static SiteContentDto Create(Func<string, string>? photoAddress = null)
    {
        var address = photoAddress ?? (file => $"/own/{file}");
        return new()
        {
            Header = new SiteHeaderDto
            {
                SiteName = "OWN Housing Co-op",
                SiteSubtitle = "Oakridge Women's Neighbourhood Housing Co-operative",
                MenuLinks = new()
                {
                    Link("Home", "/"),
                    Link("About us", "/#about"),
                    Link("Living here", "/#life"),
                    Link("What's on", "/#events"),
                    Link("Contact", "/#contact"),
                },
                SignInLink = Link("Member sign in", "/login"),
                VisitLink = Link("Book a visit", "/#visit"),
            },
            Footer = new SiteFooterDto
            {
                ContactHeading = "Visit or write",
                Organisation = "OWN Housing Co-operative Inc.",
                Area = "St. Lawrence neighbourhood, downtown Toronto",
                Phone = "416 555 0142",
                Email = "office@ownhousing.example",
                SiteLinksHeading = "Around the site",
                SiteLinks = new()
                {
                    Link("About us", "/#about"),
                    Link("Living here", "/#life"),
                    Link("What's on", "/#events"),
                    Link("Our board", "/#board"),
                },
                MemberLinksHeading = "For members",
                MemberLinks = new()
                {
                    Link("Member sign in", "/login"),
                    Link("Report a repair", "/maintenance"),
                    Link("Documents and bylaws", "/documents"),
                },
                Copyright = "© 2026 OWN Housing Co-operative Inc. Built to WCAG 2.2 AA and usable at 400% zoom. If anything is hard to use, please tell us.",
                WebsiteLine = "Website managed by the Co-op with Coop.",
            },
            Home = new HomeContentDto
            {
                Sections = new()
                {
                new HeroDto
                {
                    Eyebrow = "A co-operative for older women",
                    Title = "A home of our own, in the heart of Toronto.",
                    Lead = "Bright apartments, a rooftop garden, and neighbours who look out for one another. Run by the women who live here.",
                    Badge = "Welcoming members since 1997",
                    PrimaryAction = Link("Book a visit", "/#visit"),
                    SecondaryAction = Link("How to apply", "/#visit"),
                    Photo = Photo(address("hero.svg"), "Our brick building with balconies and a rooftop garden. Two women chat on a bench out front while a neighbour walks her dog.", 1200, 900),
                },
                new GlanceDto
                {
                    Figures = new()
                    {
                        new FigureDto { Value = "142", Label = "homes, from bachelor to two-bedroom" },
                        new FigureDto { Value = "1997", Label = "the year we opened our doors" },
                        new FigureDto { Value = "100%", Label = "run by the women who live here" },
                    },
                },
                new AboutDto
                {
                    Eyebrow = "Who we are",
                    Title = "Older women built this place. We still run it.",
                    Lead = "Our founding members imagined a building where women could grow older with dignity, affordable rent and friends down the hall. In 1997 the doors opened. They have stayed open ever since.",
                    Values = new()
                    {
                        new ValueCardDto { Icon = "members", Title = "Run by members", Text = "Every member has a vote. Our board is elected from our own neighbours." },
                        new ValueCardDto { Icon = "affordable", Title = "Affordable for life", Text = "Most homes are geared to income, so rent stays within reach as life changes." },
                        new ValueCardDto { Icon = "company", Title = "Never far from company", Text = "Tea on Tuesdays, a choir on Thursdays, and a garden that always needs a hand." },
                    },
                },
                new GalleryDto
                {
                    Eyebrow = "A look around",
                    Title = "Come in. Have a look.",
                    Photos = new()
                    {
                        GalleryPhoto(Photo(address("tea.svg"), "Three women around a round table set with a green teapot, colourful cups and a plate of biscuits.", 800, 600), "Tuesday tea in the lounge", "wide"),
                        GalleryPhoto(Photo(address("choir.svg"), "Five women in bright colours sing together from song sheets.", 800, 1000), "The Thursday choir", "tall"),
                        GalleryPhoto(Photo(address("garden.svg"), "A woman in a sun hat waters planters of flowers and herbs on the rooftop, the city skyline behind her.", 800, 600), "The rooftop garden", "small"),
                        GalleryPhoto(Photo(address("lobby.svg"), "A sunny lobby with a tall arched window, a plum armchair, a lamp and a noticeboard full of colourful notices.", 800, 600), "Our front lobby", "small"),
                        GalleryPhoto(Photo(address("workshop.svg"), "Two pairs of hands knit a terracotta scarf at a table covered in balls of yarn.", 800, 600), "Knitting circle, Wednesday mornings", "wide"),
                        GalleryPhoto(Photo(address("hero.svg"), "Our building seen from the park, with trees on either side and a bench out front.", 1200, 900), "Home, from the park", "small"),
                    },
                },
                new FeaturesDto
                {
                    Rows = new()
                    {
                        new FeatureRowDto
                        {
                            Eyebrow = "Our building",
                            Title = "Built for getting older in.",
                            Items = new() { "Step-free entrance and two lifts", "Bright apartments with a balcony or a big window", "Laundry, lounge and a guest suite on site" },
                            Photo = Photo(address("lobby.svg"), "The front lobby, with a comfortable armchair beside a sunny window.", 800, 600),
                        },
                        new FeatureRowDto
                        {
                            Eyebrow = "Our community",
                            Title = "Good neighbours, by design.",
                            Items = new() { "A choir, a knitting circle and a book club", "Neighbours who check in when you are unwell", "A say in every decision, at every meeting" },
                            Photo = Photo(address("workshop.svg"), "Hands knitting at a table of yarn, a finished striped scarf hanging nearby.", 800, 600),
                        },
                    },
                },
                new NoticesDto
                {
                    Eyebrow = "What's on",
                    Title = "Something for every week.",
                    Lead = "Everyone is welcome. Bring a friend.",
                    EmptyMessage = "No notices right now. Check back soon.",
                },
                new BoardDto { Eyebrow = "Meet the board", Title = "Elected by neighbours, for neighbours." },
                new QuoteDto
                {
                    Text = "I came for an apartment I could afford. I stayed for the women down the hall.",
                    Attribution = "Beatrix, member since 2003",
                    Photo = Photo(address("quote.svg"), "Beatrix, laughing, in a green cardigan and a coral scarf.", 600, 600),
                },
                new VisitDto
                {
                    Eyebrow = "Visit or apply",
                    Title = "Come and see for yourself.",
                    Lead = "Call the office and we will show you around, answer your questions, and explain how applications and the waiting list work.",
                    Phone = "416 555 0142",
                    Hours = "Monday to Friday, 9 am to 4 pm",
                    Action = Link("Send us a note", "/#contact"),
                },
                },
            },
        };
    }

    private static LinkDto Link(string label, string href) => new() { Label = label, Href = href };

    private static PhotoDto Photo(string src, string alt, int width, int height)
        => new() { Src = src, Alt = alt, Width = width, Height = height };

    private static GalleryPhotoDto GalleryPhoto(PhotoDto photo, string caption, string size)
        => new() { Photo = photo, Caption = caption, Size = size };
}
