/** The public site's fixed labels, the words that are not site content (L2-REQ-131 AC5). */
export interface UiLabels {
  /** The language button: the other language, named in that language. */
  otherLanguage: string;
  /** The polite status after switching to this language. */
  switched: string;
  skipToContent: string;
  primaryNav: string;
  menu: string;
  close: string;
  /** The brand link's accessible name. */
  home: (siteName: string) => string;
  glance: string;
  features: string;
  quote: string;
  pageLoading: string;
  pageLoadingStatus: string;
  pageError: string;
  pageErrorLead: string;
  pageErrorHelp: string;
  tryAgain: string;
  pageNotFound: string;
  pageNotFoundTitle: string;
  pageNotFoundHelp: string;
  goHome: string;
  previewTitle: string;
  previewText: string;
  previewExpiredTitle: string;
  previewExpiredText: string;
}
