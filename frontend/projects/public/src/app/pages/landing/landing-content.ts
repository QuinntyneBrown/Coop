import type { LandingContent } from './landing-content-shape';

/**
 * Default copy and the photograph manifest for every block of the home page,
 * in the order the OWN design draws them (docs/mocks/pages/public-landing/).
 * The site name, navigation and footer live in layout/site-content.ts.
 * The hero title and lead, the board list and the notices are replaced by CMS
 * content when the API returns it. Replace a photograph by replacing its file
 * under `public/own/` and its entry here.
 *
 * People, events and contact details are fictional.
 */
export const LANDING_CONTENT: LandingContent = {
  hero: {
    eyebrow: 'A co-operative for older women',
    title: 'A home of our own, in the heart of Toronto.',
    subtitle:
      'Bright apartments, a rooftop garden, and neighbours who look out for one another. Run by the women who live here.',
    photo: {
      src: 'own/hero.svg',
      alt: 'Our brick building with balconies and a rooftop garden. Two women chat on a bench out front while a neighbour walks her dog.',
      width: 1200,
      height: 900,
    },
    badge: 'Welcoming members since 1997',
  },
  stats: [
    { value: '142', label: 'homes, from bachelor to two-bedroom' },
    { value: '1997', label: 'the year we opened our doors' },
    { value: '1', label: 'rooftop garden, shared by everyone' },
  ],
  about: {
    eyebrow: 'Who we are',
    title: 'Older women built this place. We still run it.',
    lead: "The Older Women's Network imagined a building where women could grow older with dignity, affordable rent and friends down the hall. In 1997 the doors opened. They have stayed open ever since.",
  },
  values: [
    {
      title: 'Run by members',
      text: 'Every member has a vote. Our board is elected from our own neighbours.',
      tone: 'green',
      icon: 'members',
    },
    {
      title: 'Affordable for life',
      text: 'Most homes are geared to income, so rent stays within reach as life changes.',
      tone: 'accent',
      icon: 'affordable',
    },
    {
      title: 'Never far from company',
      text: 'Tea on Tuesdays, a choir on Thursdays, and a garden that always needs a hand.',
      tone: 'plum',
      icon: 'company',
    },
  ],
  gallery: { eyebrow: 'A look around', title: 'Come in. Have a look.' },
  photos: [
    {
      src: 'own/tea.svg',
      alt: 'Three women around a round table set with a green teapot, colourful cups and a plate of biscuits.',
      width: 800,
      height: 600,
      caption: 'Tuesday tea in the lounge',
      layout: 'wide',
    },
    {
      src: 'own/choir.svg',
      alt: 'Five women in bright colours sing together from song sheets.',
      width: 800,
      height: 1000,
      caption: 'The Thursday choir',
      layout: 'tall',
    },
    {
      src: 'own/garden.svg',
      alt: 'A woman in a sun hat waters planters of flowers and herbs on the rooftop, the city skyline behind her.',
      width: 800,
      height: 600,
      caption: 'The rooftop garden',
      layout: 'small',
    },
    {
      src: 'own/lobby.svg',
      alt: 'A sunny lobby with a tall arched window, a plum armchair, a lamp and a noticeboard full of colourful notices.',
      width: 800,
      height: 600,
      caption: 'Our front lobby',
      layout: 'small',
    },
    {
      src: 'own/workshop.svg',
      alt: 'Two pairs of hands knit a terracotta scarf at a table covered in balls of yarn.',
      width: 800,
      height: 600,
      caption: 'Knitting circle, Wednesday mornings',
      layout: 'wide',
    },
    {
      src: 'own/hero.svg',
      alt: 'Our building seen from the park, with trees on either side and a bench out front.',
      width: 1200,
      height: 900,
      caption: 'Home, from the park',
      layout: 'small',
    },
  ],
  features: [
    {
      eyebrow: 'Our building',
      title: 'Built for getting older in.',
      items: [
        'Step-free entrance and two lifts',
        'Bright apartments with a balcony or a big window',
        'Laundry, lounge and a guest suite on site',
      ],
      photo: {
        src: 'own/lobby.svg',
        alt: 'The front lobby, with a comfortable armchair beside a sunny window.',
        width: 800,
        height: 600,
      },
      flip: false,
    },
    {
      eyebrow: 'Our community',
      title: 'Good neighbours, by design.',
      items: [
        'A choir, a knitting circle and a book club',
        'Neighbours who check in when you are unwell',
        'A say in every decision, at every meeting',
      ],
      photo: {
        src: 'own/workshop.svg',
        alt: 'Hands knitting at a table of yarn, a finished striped scarf hanging nearby.',
        width: 800,
        height: 600,
      },
      flip: true,
    },
  ],
  notices: {
    eyebrow: "What's on",
    title: 'Something for every week.',
    lead: 'Everyone is welcome. Bring a friend.',
  },
  noticesEmpty: 'No notices right now. Check back soon.',
  board: { eyebrow: 'Meet the board', title: 'Elected by neighbours, for neighbours.' },
  quote: {
    text: 'I came for an apartment I could afford. I stayed for the women down the hall.',
    attribution: 'Beatrix, member since 2003',
    photo: {
      src: 'own/quote.svg',
      alt: 'Beatrix, laughing, in a green cardigan and a coral scarf.',
      width: 600,
      height: 600,
    },
  },
  visit: {
    eyebrow: 'Visit or apply',
    title: 'Come and see for yourself.',
    lead: 'Call the office and we will show you around, answer your questions, and explain how applications and the waiting list work.',
    phone: '416 555 0142',
    phoneHref: 'tel:+14165550142',
    hours: 'Monday to Friday, 9 am to 4 pm',
  },
};
