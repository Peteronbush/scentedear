import { getSupabase } from "./client";
import { Profile, ProfileUpsert } from "../../types/profile";

/** Fetch the current user's profile */
export async function getMyProfile(): Promise<Profile | null> {
  const { data, error } = await getSupabase()
    .from("profiles")
    .select("*")
    .single();
  if (error) return null;
  return data as Profile;
}

/** Update nickname / birth_date / gender for the current user */
export async function updateProfile(payload: ProfileUpsert): Promise<Profile> {
  const { data, error } = await getSupabase()
    .from("profiles")
    .update(payload)
    .select()
    .single();
  if (error) throw error;
  return data as Profile;
}

/** Sign up with email + password, then fill in profile fields */
export async function signUp(
  email: string,
  password: string,
  profile: ProfileUpsert
): Promise<void> {
  const { data, error } = await getSupabase().auth.signUp({ email, password });
  if (error) throw error;

  const userId = data.user?.id;
  if (!userId) throw new Error("회원가입 후 사용자 정보를 불러올 수 없습니다.");

  // The trigger auto-creates a profiles row; we upsert the rest of the fields.
  const { error: profileError } = await getSupabase()
    .from("profiles")
    .upsert({ id: userId, email, ...profile });
  if (profileError) throw profileError;
}

/** Sign in */
export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await getSupabase().auth.signInWithPassword({ email, password });
  if (error) throw error;
}

/** Sign out */
export async function signOut(): Promise<void> {
  await getSupabase().auth.signOut();
}
