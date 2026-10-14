/** One "Who we are" value card; its colour follows its position. */
export interface ValueCard {
  icon: 'members' | 'affordable' | 'company';
  title: string;
  text: string;
}
