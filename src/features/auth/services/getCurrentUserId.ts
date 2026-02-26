import { supabase } from "@/lib/supabase";

/**
 * Retrieves the current authenticated user's ID from Supabase session.
 * @returns Promise<string | null> - The user ID if authenticated, otherwise null.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

