/** Status message after a published notice is sent to members (L2-REQ-093 AC3). */
export function noticeSentMessage(title: string): string {
  return `“${title}” is published and sent to members who asked for notices.`;
}

/** Alert when a published notice could not be sent to members (L2-REQ-093 AC4). */
export function noticeNotSentMessage(title: string): string {
  return `“${title}” is published, but it was not sent to members. Press Save to try again.`;
}
