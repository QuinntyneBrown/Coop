import { ADMIN_LOGIN_URL } from '../../pages/admin/login.page';

/**
 * The SiteContent entry the API seeds (backend/src/Coop.Api/SiteContentSeed.cs):
 * every value the public site shows. People and contact details are fictional.
 * The sign-in links hold the admin login address, as an administrator would
 * publish it (L2-REQ-101); the API seed's `/login` reaches the same screen.
 */
export function createSiteContent(): Record<string, any> {
  const link = (label: string, href: string) => ({ label, href });
  const photo = (src: string, alt: string, width: number, height: number) => ({
    src,
    alt,
    width,
    height,
  });

  return {
    header: {
      siteName: 'OWN Housing Co-op',
      siteSubtitle: "Oakridge Women's Neighbourhood Housing Co-operative",
      menuLinks: [
        link('Home', '/'),
        link('About us', '/#about'),
        link('Living here', '/#life'),
        link("What's on", '/#events'),
        link('Contact', '/#contact'),
      ],
      signInLink: link('Member sign in', ADMIN_LOGIN_URL),
      visitLink: link('Book a visit', '/#visit'),
    },
    footer: {
      contactHeading: 'Visit or write',
      organisation: 'OWN Housing Co-operative Inc.',
      area: 'St. Lawrence neighbourhood, downtown Toronto',
      phone: '416 555 0142',
      email: 'office@ownhousing.example',
      siteLinksHeading: 'Around the site',
      siteLinks: [
        link('About us', '/#about'),
        link('Living here', '/#life'),
        link("What's on", '/#events'),
        link('Our board', '/#board'),
      ],
      memberLinksHeading: 'For members',
      memberLinks: [
        link('Member sign in', ADMIN_LOGIN_URL),
        link('Report a repair', '/maintenance'),
        link('Documents and bylaws', '/documents'),
      ],
      copyright:
        '© 2026 OWN Housing Co-operative Inc. Built to WCAG 2.2 AA and usable at 400% zoom. If anything is hard to use, please tell us.',
      websiteLine: 'Website managed by the Co-op with Coop.',
    },
    home: {
      hero: {
        eyebrow: 'A co-operative for older women',
        title: 'A home of our own, in the heart of Toronto.',
        lead: 'Bright apartments, a rooftop garden, and neighbours who look out for one another. Run by the women who live here.',
        badge: 'Welcoming members since 1997',
        primaryAction: link('Book a visit', '/#visit'),
        secondaryAction: link('How to apply', '/#visit'),
        photo: photo(
          '/own/hero.svg',
          'Our brick building with balconies and a rooftop garden. Two women chat on a bench out front while a neighbour walks her dog.',
          1200,
          900,
        ),
      },
      glance: {
        figures: [
          { value: '142', label: 'homes, from bachelor to two-bedroom' },
          { value: '1997', label: 'the year we opened our doors' },
          { value: '100%', label: 'run by the women who live here' },
        ],
      },
      about: {
        eyebrow: 'Who we are',
        title: 'Older women built this place. We still run it.',
        lead: "Our founding members imagined a building where women could grow older with dignity, affordable rent and friends down the hall. In 1997 the doors opened. They have stayed open ever since.",
        values: [
          {
            icon: 'members',
            title: 'Run by members',
            text: 'Every member has a vote. Our board is elected from our own neighbours.',
          },
          {
            icon: 'affordable',
            title: 'Affordable for life',
            text: 'Most homes are geared to income, so rent stays within reach as life changes.',
          },
          {
            icon: 'company',
            title: 'Never far from company',
            text: 'Tea on Tuesdays, a choir on Thursdays, and a garden that always needs a hand.',
          },
        ],
      },
      gallery: {
        eyebrow: 'A look around',
        title: 'Come in. Have a look.',
        photos: [
          {
            photo: photo(
              '/own/tea.svg',
              'Three women around a round table set with a green teapot, colourful cups and a plate of biscuits.',
              800,
              600,
            ),
            caption: 'Tuesday tea in the lounge',
            size: 'wide',
          },
          {
            photo: photo(
              '/own/choir.svg',
              'Five women in bright colours sing together from song sheets.',
              800,
              1000,
            ),
            caption: 'The Thursday choir',
            size: 'tall',
          },
          {
            photo: photo(
              '/own/garden.svg',
              'A woman in a sun hat waters planters of flowers and herbs on the rooftop, the city skyline behind her.',
              800,
              600,
            ),
            caption: 'The rooftop garden',
            size: 'small',
          },
          {
            photo: photo(
              '/own/lobby.svg',
              'A sunny lobby with a tall arched window, a plum armchair, a lamp and a noticeboard full of colourful notices.',
              800,
              600,
            ),
            caption: 'Our front lobby',
            size: 'small',
          },
          {
            photo: photo(
              '/own/workshop.svg',
              'Two pairs of hands knit a terracotta scarf at a table covered in balls of yarn.',
              800,
              600,
            ),
            caption: 'Knitting circle, Wednesday mornings',
            size: 'wide',
          },
          {
            photo: photo(
              '/own/hero.svg',
              'Our building seen from the park, with trees on either side and a bench out front.',
              1200,
              900,
            ),
            caption: 'Home, from the park',
            size: 'small',
          },
        ],
      },
      features: {
        rows: [
          {
            eyebrow: 'Our building',
            title: 'Built for getting older in.',
            items: [
              'Step-free entrance and two lifts',
              'Bright apartments with a balcony or a big window',
              'Laundry, lounge and a guest suite on site',
            ],
            photo: photo(
              '/own/lobby.svg',
              'The front lobby, with a comfortable armchair beside a sunny window.',
              800,
              600,
            ),
          },
          {
            eyebrow: 'Our community',
            title: 'Good neighbours, by design.',
            items: [
              'A choir, a knitting circle and a book club',
              'Neighbours who check in when you are unwell',
              'A say in every decision, at every meeting',
            ],
            photo: photo(
              '/own/workshop.svg',
              'Hands knitting at a table of yarn, a finished striped scarf hanging nearby.',
              800,
              600,
            ),
          },
        ],
      },
      notices: {
        eyebrow: "What's on",
        title: 'Something for every week.',
        lead: 'Everyone is welcome. Bring a friend.',
        emptyMessage: 'No notices right now. Check back soon.',
      },
      board: { eyebrow: 'Meet the board', title: 'Elected by neighbours, for neighbours.' },
      quote: {
        text: 'I came for an apartment I could afford. I stayed for the women down the hall.',
        attribution: 'Beatrix, member since 2003',
        photo: photo(
          '/own/quote.svg',
          'Beatrix, laughing, in a green cardigan and a coral scarf.',
          600,
          600,
        ),
      },
      visit: {
        eyebrow: 'Visit or apply',
        title: 'Come and see for yourself.',
        lead: 'Call the office and we will show you around, answer your questions, and explain how applications and the waiting list work.',
        phone: '416 555 0142',
        hours: 'Monday to Friday, 9 am to 4 pm',
        action: link('Send us a note', '/#contact'),
      },
    },
  };
}
