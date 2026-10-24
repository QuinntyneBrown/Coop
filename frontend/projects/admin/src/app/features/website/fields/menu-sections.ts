import { link, links, paragraph, text } from './field-helpers';
import type { SectionDefinition } from './section-definition';

/** The menu and the footer, shown on every public page (L2-REQ-095, L2-REQ-119). */
export const MENU_SECTIONS: SectionDefinition[] = [
  {
    kind: 'header',
    name: 'Menu',
    placement: 'Appears at the top of every page: the site name and the menu links.',
    anchor: 'top',
    path: 'header',
    fields: [
      text('siteName', 'Site name', true),
      text('siteSubtitle', 'Subtitle under the site name'),
      links('menuLinks', 'Menu links', 'menu link'),
      link('signInLink', 'Sign-in button'),
      link('visitLink', 'Visit button in the phone menu'),
    ],
  },
  {
    kind: 'footer',
    name: 'Footer',
    placement: 'Appears at the bottom of every page.',
    anchor: 'contact',
    path: 'footer',
    fields: [
      text('contactHeading', 'Heading over the contact details'),
      text('organisation', 'Organisation name'),
      text('area', 'Neighbourhood'),
      text('phone', 'Phone number'),
      text('email', 'E-mail address'),
      text('siteLinksHeading', 'Heading over the site links'),
      links('siteLinks', 'Site links', 'site link'),
      text('memberLinksHeading', 'Heading over the member links'),
      links('memberLinks', 'Member links', 'member link'),
      paragraph('copyright', 'Copyright line'),
      text('websiteLine', 'Website line'),
    ],
  },
];
