# User Journeys

User journeys implemented in Coop, taken from the Playwright suite. The number
is the journey's rank by value provided, highest first, and matches its video
in [`docs/videos/journeys/`](videos/journeys/).

Coop has two sites (ADR 0016):

- the **public site**, read-only and anonymous (L2-REQ-110);
- the **admin site**, which everyone who signs in uses. Members see only the
  member areas: Dashboard, Maintenance, Documents, Messages and My profile
  (L2-REQ-112). The office (staff, board members, system administrators and
  support) sees every area.

The public site shows the published site content. The office edits a draft in
the Website area, previews it on the public site through a short-lived token
and publishes it in one step (ADR 0018 to ADR 0021).

## Visitors (public site)

| # | Journey | Description |
| --- | --- | --- |
| 6 | Read documents | Filter the published notices, by-laws and reports by type and open one in the viewer. |
| 10 | Browse the home page | Read the published home page sections in the office's order, the board, notices and the footer. |
| 11 | Read a website page | Open a published page the office added from the site navigation, with its banner and blocks. |
| 14 | Use the phone menu | Open and close the navigation on a small screen. |

## Everyone who signs in (admin site)

| # | Journey | Description |
| --- | --- | --- |
| 4 | Sign in | Follow Member sign in from the public site to the admin login, or reach Forgot password. |
| 8 | Register | Create an account with an invitation from the office. |
| 13 | Change my password | Update the password from My profile. |
| 15 | Sign out | Sign out from My profile. |

## Members (admin site, member view)

| # | Journey | Description |
| --- | --- | --- |
| 1 | Submit a maintenance request | Create a request with details and photos. |
| 2 | Follow a maintenance request | Filter own requests, check status, read and add comments, add a photo. |
| 3 | Read new notices | Choose how notices reach you; read them on the dashboard and in Documents. |
| 5 | Message the office | Read own conversations and reply. |
| 7 | View the dashboard | See own counts, recent requests, notices and actions. |
| 9 | Onboard | Welcome, profile, unit selection and confirmation, or skip. |
| 12 | Manage my profile | Edit details, set or remove a picture, choose how notices arrive. |

## Office (admin site, every area)

| # | Journey | Description |
| --- | --- | --- |
| 16 | Handle maintenance requests | Filter, read details and photos, comment, receive, start and finish. |
| 17 | Send a notice to members | Publish a notice and send it to members who asked for notices. |
| 18 | Invite members | Create invitations, copy the token and track their status. |
| 19 | Manage users | Search, page through, add, edit and delete users. |
| 20 | Manage documents | Create, search, filter by tab and delete documents. |
| 21 | Message members | Start conversations, search them and send messages. |
| 22 | View the office dashboard | Metrics, recent requests, notices and quick actions. |
| 23 | Edit website content | Open the site tree, edit the home page sections and the menu and footer, reorder or hide sections, choose photos, preview the draft, then publish or discard it. |
| 24 | Manage website pages | Add a page with a banner and body blocks, order the blocks, show it in the menu, publish it and remove it. |
| 25 | Manage roles and privileges | Select a role and toggle its privileges. |
| 26 | Manage the board of directors | Add, edit, reorder and remove directors; the home page and the landing page follow. |
| 27 | Manage profiles | Select a profile, edit it, set a photo and a board title. |
| 28 | Manage digital assets | Upload, search, open, download and delete the photos and files in the library. |
| 29 | Customize the theme | Choose a scope, change the colours, check the preview, then save or reset. |
