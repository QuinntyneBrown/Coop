/** The "New notices" row on the profile (L2-REQ-092 AC1). */
export function noticeChoiceLabel(
  byEmail: boolean | undefined,
  byText: boolean | undefined,
): string {
  if (byEmail && byText) return 'By email and text message';
  if (byEmail) return 'By email';
  if (byText) return 'By text message';
  return 'Not sent to you';
}

/** Why the chosen way of getting notices cannot be saved, or '' (L2-REQ-092 AC3). */
export function noticeChoiceError(form: {
  email: string;
  phone: string;
  noticeByEmail: boolean;
  noticeByText: boolean;
}): string {
  if (form.noticeByEmail && !form.email.trim())
    return 'Add your email address to get notices by email.';
  if (form.noticeByText && !form.phone.trim())
    return 'Add your phone number to get notices by text message.';
  return '';
}
