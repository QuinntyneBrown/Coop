import type { ContentRecord } from './content-record';

/** One block of a website page's body: its `kind` and that kind's values (L2-REQ-123). */
export type PageBlock = ContentRecord & { kind: string };
