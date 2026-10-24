# 0019. Public preview mode through short-lived tokens, not the admin's JWT

- Status: Accepted
- Date: 2026-10-24

## Context

The page editor shows the public site rendering the draft, and "Preview
site" opens it in a new tab (L2-REQ-125). The public app is read-only and
anonymous (ADR 0016): it has no sign-in and should hold no credential. The
draft is office-only (L2-REQ-128). The public app needs a way to ask the
API for the draft without becoming a signed-in app, and the admin needs a
way to hand it that permission.

Passing the admin's JWT to the public app in a URL would put a full
credential in browser history, referrer headers and shared links, and would
let the public app act as the office.

## Decision

- `POST api/site-content/preview-token` (`IssuePreviewTokenRequest`, office
  only) answers with a token and its expiry. The token is valid for 60
  minutes.
- The token is an HMAC-signed expiry: `base64url(expiry-seconds) + "." +
  base64url(HMAC-SHA256(expiry-seconds))`, keyed by the API's
  `Authentication:JwtKey`. Nothing is stored and nothing identifies the
  person who asked. `IPreviewTokenService` in `Coop.Application` issues and
  checks it; `PreviewTokenService` in `Coop.Infrastructure.Identity`
  implements it.
- The token is honoured by three anonymous reads only:
  `GET api/site-content?preview={token}` (the draft, else the published
  copy), `GET api/pages?preview={token}` and
  `GET api/pages/{slug}?preview={token}` (unpublished pages included). The
  handlers check it; an invalid or expired token on the site content read
  answers 403, and on the page reads falls back to the published-only
  rules. No other endpoint reads it, it is not a bearer token, and it is
  never accepted in an `Authorization` header.
- The public app takes `?preview={token}` from its address, sends it on
  those reads, keeps it for in-app navigation, and shows a banner saying it
  is a preview. When the API refuses the token it shows the published
  content and says the link has expired.
- The admin requests a token when the page editor opens and again when a
  save finds the token older than its lifetime; the preview pane and
  "Preview site" use the same address.

## Consequences

- The public app stays anonymous and holds no credential that can act.
- A leaked preview link reveals the draft for at most 60 minutes and can
  change nothing. The draft is not secret content, only unpublished.
- Changing `Authentication:JwtKey` invalidates outstanding preview links,
  which is acceptable.
- Tokens cannot be revoked one by one; their short life stands in for
  revocation.
- The Playwright mock API issues and checks tokens with the same shape and
  the same 60-minute rule.
