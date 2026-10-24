/** A published document as the public Documents page shows it (L2-REQ-035). */
export interface CoopDocument {
  id: string;
  title: string;
  type: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  fileUrl?: string;
}
