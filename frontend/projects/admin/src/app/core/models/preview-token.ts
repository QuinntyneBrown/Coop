/** A short-lived token the public site presents to show the draft (`POST /site-content/preview-token`, L2-REQ-125). */
export interface PreviewToken {
  token: string;
  /** When the token stops working, as an ISO date. */
  expiresOn: string;
}
