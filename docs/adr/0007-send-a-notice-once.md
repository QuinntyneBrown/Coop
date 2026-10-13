# 0007. Send a notice once

- Status: Accepted
- Date: 2026-10-13

## Context

The office sends a published notice to the members who asked for new
notices by email or text message (L2-REQ-093). The request can be sent
twice: the browser resends after a dropped connection, or the office presses
"Save" again because the first attempt looked stuck or failed. A member who
gets the same notice two or three times is confused, and with a paid text
message provider every repeat costs money. `AGENTS.md` asks that mutations
which may be retried are idempotent and that the decision is recorded in an
ADR.

No email or text message provider is chosen yet. Messages go through one
sender service, `INoticeSender`; the default one writes each message to the
API log.

## Decision

- A `Notice` records `SentOn`, the time it was sent to members.
- `POST /api/notice/{documentId}/send` sends to the members who chose email
  or text, then sets `SentOn` and saves. A notice whose `SentOn` is set is
  returned unchanged with status 200, and nothing is sent again.
- The messages are handed to `INoticeSender` before `SentOn` is saved. If the
  sender fails part way, `SentOn` stays empty, the API answers with an error
  and the office can try again.

## Consequences

- A retried send, from the browser or the office, sends each member one
  message.
- A sender that fails part way and is retried can send a second copy to the
  members it reached the first time. When a real provider is connected, its
  own retry and duplicate rules decide whether that is acceptable or whether
  the sends need to be recorded one by one.
- A notice can be sent once. Sending a corrected notice again means
  publishing a new notice.
- The admin dialog keeps the id of the notice it created while it stays
  open, so pressing "Save" after a failed send does not create a second
  notice.
- The Playwright mock API in `e2e/fixtures/mock-api/` records `sentOn` the
  same way.
