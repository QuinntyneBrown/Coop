/** Plain-language name of a profile type, shown in the Switch Profile list (L2-REQ-018 AC4). */
export function profileTypeLabel(type: string | undefined): string {
  switch (type) {
    case 'Member':
      return 'Member';
    case 'BoardMember':
      return 'Board member';
    case 'StaffMember':
      return 'Staff member';
    case 'OnCall':
      return 'On call';
    default:
      return '';
  }
}
