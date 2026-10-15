# 0008. Send notice emails over SMTP

- Status: Accepted
- Date: 2026-10-15

## Context

The office sends a published notice to members who chose email or text
message (L2-REQ-093). Until now the only sender, `LoggingNoticeSender`,
writes each message to the API log and sends nothing, so members who chose
email get nothing. The co-op is small and has no email provider yet. Any
mailbox or email service the co-op already has offers SMTP. A vendor API
would tie the project to one provider, and a vendor package would add a
dependency that `AGENTS.md` asks us to avoid without need.

## Decision

- Notice emails go out through `SmtpNoticeSender`, which uses
  `System.Net.Mail.SmtpClient` from the .NET base library. No new package is
  added.
- Settings live under `Notices:Email` (host, port, user name, password, from
  address and name). The password and user name come from user secrets or
  environment variables and are never put in `appsettings.json` or logged.
- `Dependencies.cs` registers `SmtpNoticeSender` only when `Host` is set. A
  `PickupDirectory` setting writes each email as an `.eml` file instead of
  using the network, for local runs and acceptance tests, which must not use
  the network.
- Without either setting, `LoggingNoticeSender` stays the sender, so a
  fresh clone and the Playwright suite still send nothing.
- Text messages stay log-only. No text provider is chosen.
- A refused or unreachable server makes the sender throw. `SentOn` stays
  empty and the office can send again, as ADR 0007 decided.

## Consequences

- Connecting OWN's mailbox is configuration, not code.
- A send that fails part way and is retried can send a second copy to the
  members it already reached. ADR 0007 left this open for the real
  provider. For a small co-op we accept it and do not record each
  recipient's send.
- Emails are plain text. HTML, templates, queues, automatic retries and
  background jobs are not part of this decision.
- Sending is one request that waits for the server, one message at a time.
  That is acceptable for the co-op's size and should be revisited if the
  member list grows large.
