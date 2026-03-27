export interface Fragrance {
  id: string;
  name: string;
  house: string;
  icon: string;
  notes?: string[];
  family?: string;
}

export interface OnboardingData {
  collection: Fragrance[];
  favoriteId: string | null;
  dislikedFragrances: Fragrance[];
  dislikedCategories: string[];
  favoriteHouses: string[];
  priorities: string[];
}
