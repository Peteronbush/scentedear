// ── DB row (1:1 with fragrances table) ──────────────────────
export interface Fragrance {
  id: number;
  name: string;
  house: string;
  concentration: string | null;
  gender: "Male" | "Female" | "Unisex" | null;
  family: string | null;
  top_notes: string[];
  middle_notes: string[];
  base_notes: string[];
  year: number | null;
  description_ko: string | null;
  longevity_avg: number | null;
  projection_avg: number | null;
  rating_avg: number | null;
  accords: string[];
  keywords_ko: string[];
  season: Array<"Spring" | "Summer" | "Fall" | "Winter">;
  occasion: Array<"Casual" | "Office" | "Date" | "Evening" | "Formal" | "Sport">;
  intensity: number | null;   // 1–5
  warmth: number | null;      // 1–5
  sweetness: number | null;   // 1–5
  popularity: number | null;  // 1–10
  price_tier: "Budget" | "Mid" | "Luxury" | "Ultra" | null;
  embedding: number[] | null;
  created_at: string;
  updated_at: string;
}

// ── Search / filter params ────────────────────────────────────
export interface FragranceFilter {
  query?: string;           // name or house text search
  house?: string;
  gender?: Fragrance["gender"];
  family?: string;
  season?: Fragrance["season"][number];
  occasion?: Fragrance["occasion"][number];
  price_tier?: Fragrance["price_tier"];
  accord?: string;
  min_rating?: number;
  min_popularity?: number;
  limit?: number;
  offset?: number;
}
