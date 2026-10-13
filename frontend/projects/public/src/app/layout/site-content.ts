import type { SiteContent } from './site-content-shape';

/**
 * Site name, home page section links and footer copy for the shared header
 * and footer (docs/mocks/pages/public-landing/, public-page/). Section links
 * are absolute so they work from a website page as well as from the home
 * page. Contact details are fictional.
 */
export const SITE_CONTENT: SiteContent = {
  siteName: 'OWN Housing Co-op',
  siteSubtitle: "Older Women's Network Housing Co-operative",
  navigation: [
    { label: 'Home', route: '/' },
    { label: 'About us', href: '/#about' },
    { label: 'Living here', href: '/#life' },
    { label: "What's on", href: '/#events' },
    { label: 'Contact', href: '/#contact' },
  ],
  footer: {
    organisation: 'OWN Housing Co-operative Inc.',
    area: 'St. Lawrence neighbourhood, downtown Toronto',
    phone: '416 555 0142',
    phoneHref: 'tel:+14165550142',
    email: 'office@ownhousing.example',
    siteLinks: [
      { label: 'About us', href: '/#about' },
      { label: 'Living here', href: '/#life' },
      { label: "What's on", href: '/#events' },
      { label: 'Our board', href: '/#board' },
    ],
    memberLinks: [
      { label: 'Member sign in', route: '/login' },
      { label: 'Report a repair', route: '/maintenance' },
      { label: 'Documents and bylaws', route: '/documents' },
    ],
    copyright:
      '© 2026 OWN Housing Co-operative Inc. Built to WCAG 2.2 AA and usable at 400% zoom. If anything is hard to use, please tell us.',
    managedBy: 'Website managed by the Co-op with Coop.',
  },
};
