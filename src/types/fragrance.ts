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
  year: number;
  longevityAvg: number;
  projectionAvg: number;
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
