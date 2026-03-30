export interface Fragrance {
  id: string;
  name: string;
  house: string;
  concentration: string;
  gender: string;
  family: string;
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  year: number | null;
  longevityAvg: number | null;
  projectionAvg: number | null;
  icon: string;
}

export interface OnboardingData {
  collection: Fragrance[];
  favoriteId: string | null;
  dislikedFragrances: Fragrance[];
  dislikedCategories: string[];
  favoriteHouses: string[];
  priorities: string[];
}
