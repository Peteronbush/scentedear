import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type matching the fragrances table schema
export interface FragranceRow {
  id: number;
  name: string;
  house: string;
  concentration: string | null;
  gender: string | null;
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
  season: string[];
  occasion: string[];
  intensity: number | null;
  warmth: number | null;
  sweetness: number | null;
  popularity: number | null;
  price_tier: string | null;
  created_at: string;
}
