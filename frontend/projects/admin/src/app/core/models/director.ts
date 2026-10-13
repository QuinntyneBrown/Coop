/** A director on the Board of Directors list (`GET /board-of-directors`). */
export interface Director {
  name: string;
  title: string;
  photoUrl: string | null;
}
