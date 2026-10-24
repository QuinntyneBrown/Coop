import type { DirectorDraft } from '../../../core/models/director-draft';
import type { DirectorFormErrors } from './director-form-errors';

/**
 * Client-side checks before a save (L2-REQ-085 AC5). The API applies the same
 * rules and stays authoritative.
 */
export function validateDirectorDraft(draft: DirectorDraft): DirectorFormErrors {
  const errors: DirectorFormErrors = {};
  if (!draft.name.trim()) errors.name = "Give the director's name";
  if (!draft.title.trim()) errors.title = "Give the director's role on the board";
  return errors;
}
