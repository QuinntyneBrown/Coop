import type { HomeSectionBase } from './home-section-base';
import type { GlanceFigure } from './glance-figure';

/** The "At a glance" figures. */
export interface GlanceContent extends HomeSectionBase<'glance'> {
  figures: GlanceFigure[];
}
