/** The home page section of a kind inside a site content object (`home.sections`, L2-REQ-122). */
export function homeSection(
  content: Record<string, any>,
  kind: string,
): Record<string, any> {
  const section = content?.home?.sections?.find((s: any) => s?.kind === kind);
  if (!section) throw new Error(`No "${kind}" section in the site content`);
  return section;
}
