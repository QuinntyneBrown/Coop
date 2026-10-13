import type { Director } from '../../core/models/director';

/** A copy of the list with the director at `index` swapped with its neighbour (L2-REQ-085 AC9). */
export function moveDirector(directors: Director[], index: number, offset: -1 | 1): Director[] {
  const target = index + offset;
  if (index < 0 || target < 0 || index >= directors.length || target >= directors.length) {
    return directors;
  }
  const moved = [...directors];
  [moved[index], moved[target]] = [moved[target], moved[index]];
  return moved;
}
