import { createClient } from "@supabase/supabase-js";
import { Fragrance, FragranceFilter } from "@/types/fragrance";

// Public client (anon key — safe to use in browser)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TABLE = "fragrances";

// ── getAllFragrances ──────────────────────────────────────────
export async function getAllFragrances(): Promise<Fragrance[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("popularity", { ascending: false });

  if (error) throw error;
  return data as Fragrance[];
}

// ── getFragranceById ─────────────────────────────────────────
export async function getFragranceById(id: number): Promise<Fragrance | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Fragrance;
}

// ── searchFragrances ─────────────────────────────────────────
export async function searchFragrances(
  filters: FragranceFilter
): Promise<Fragrance[]> {
  let query = supabase.from(TABLE).select("*");

  if (filters.query) {
    query = query.or(
      `name.ilike.%${filters.query}%,house.ilike.%${filters.query}%`
    );
  }
  if (filters.house)       query = query.eq("house", filters.house);
  if (filters.gender)      query = query.eq("gender", filters.gender);
  if (filters.family)      query = query.ilike("family", `%${filters.family}%`);
  if (filters.price_tier)  query = query.eq("price_tier", filters.price_tier);
  if (filters.season)      query = query.contains("season", [filters.season]);
  if (filters.occasion)    query = query.contains("occasion", [filters.occasion]);
  if (filters.accord)      query = query.contains("accords", [filters.accord]);
  if (filters.min_rating)  query = query.gte("rating_avg", filters.min_rating);
  if (filters.min_popularity) query = query.gte("popularity", filters.min_popularity);

  query = query
    .order("popularity", { ascending: false })
    .limit(filters.limit ?? 50)
    .range(filters.offset ?? 0, (filters.offset ?? 0) + (filters.limit ?? 50) - 1);

  const { data, error } = await query;
  if (error) throw error;
  return data as Fragrance[];
}

// ── getFragrancesByAccord ────────────────────────────────────
export async function getFragrancesByAccord(
  accord: string,
  limit = 20
): Promise<Fragrance[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .contains("accords", [accord])
    .order("popularity", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Fragrance[];
}

// ── getSimilarFragrances ─────────────────────────────────────
// Uses pgvector cosine similarity when embedding exists,
// falls back to same-family query otherwise.
export async function getSimilarFragrances(
  id: number,
  limit = 6
): Promise<Fragrance[]> {
  const source = await getFragranceById(id);
  if (!source) return [];

  // Vector path (embedding must be populated)
  if (source.embedding) {
    const { data, error } = await supabase.rpc("match_fragrances", {
      query_embedding: source.embedding,
      match_count: limit + 1,
    });
    if (!error && data) {
      return (data as Fragrance[]).filter((f) => f.id !== id).slice(0, limit);
    }
  }

  // Fallback: same family, sorted by popularity
  const { data } = await supabase
    .from(TABLE)
    .select("*")
    .eq("family", source.family)
    .neq("id", id)
    .order("popularity", { ascending: false })
    .limit(limit);

  return (data as Fragrance[]) ?? [];
}
