import type { HomeSectionBase } from './home-section-base';

/** The head of the "Meet the board" section; the directors come from the board list. */
export interface BoardContent extends HomeSectionBase<'board'> {
  eyebrow: string;
  title: string;
}
