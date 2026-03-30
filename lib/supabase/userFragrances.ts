import { createClient } from "@supabase/supabase-js";
import { OnboardingData } from "../../src/types/fragrance";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface UserFragranceRow {
  id: number;
  user_id: string;
  fragrance_id: string;
  fragrance_name: string;
  fragrance_house: string;
  is_favorite: boolean;
  added_at: string;
}

/** Save full onboarding result to Supabase for the signed-in user */
export async function saveOnboardingData(data: OnboardingData): Promise<void> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("로그인이 필요합니다.");

  // 1. Upsert collection fragrances
  if (data.collection.length > 0) {
    const rows = data.collection.map((f) => ({
      user_id: user.id,
      fragrance_id: f.id,
      fragrance_name: f.name,
      fragrance_house: f.house,
      is_favorite: f.id === data.favoriteId,
    }));

    const { error } = await supabase
      .from("user_fragrances")
      .upsert(rows, { onConflict: "user_id,fragrance_id" });
    if (error) throw error;
  }

  // 2. Update preference columns on profiles
  const { error: prefError } = await supabase
    .from("profiles")
    .update({
      favorite_houses: data.favoriteHouses,
      disliked_categories: data.dislikedCategories,
      priorities: data.priorities,
    })
    .eq("id", user.id);
  if (prefError) throw prefError;
}

/** Load the user's saved collection from Supabase */
export async function loadUserFragrances(): Promise<UserFragranceRow[]> {
  const { data, error } = await supabase
    .from("user_fragrances")
    .select("*")
    .order("added_at", { ascending: true });
  if (error) throw error;
  return data as UserFragranceRow[];
}
