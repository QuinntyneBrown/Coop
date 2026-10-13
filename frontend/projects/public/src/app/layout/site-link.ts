/** A navigation or footer link: an app `route` or a plain `href` such as a home page section. */
export interface SiteLink {
  label: string;
  href?: string;
  route?: string;
}
