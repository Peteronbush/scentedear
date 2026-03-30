// ── DB row (1:1 with profiles table) ─────────────────────────
export interface Profile {
  id: string;               // UUID — matches auth.users.id
  email: string;
  nickname: string;         // max 12 characters
  birth_date: string | null;  // yymmdd  e.g. "950101"
  gender: "male" | "female" | null;
  created_at: string;
  updated_at: string;
}

// ── Used when creating / updating a profile ───────────────────
export interface ProfileUpsert {
  nickname: string;
  birth_date: string | null;
  gender: "male" | "female" | null;
}
