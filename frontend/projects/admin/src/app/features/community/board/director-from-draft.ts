import type { Director } from '../../../core/models/director';
import type { DirectorDraft } from '../../../core/models/director-draft';

/** The director a valid draft describes, with blank photo addresses dropped. */
export function directorFromDraft(draft: DirectorDraft): Director {
  return {
    name: draft.name.trim(),
    title: draft.title.trim(),
    photoUrl: draft.photoUrl.trim() || null,
  };
}
