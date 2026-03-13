import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

/**
 * Central auth readiness hook.
 * Restores session from storage first, then listens for changes.
 * Components gate data fetching on `isReady && !!user`.
 */
export function useAuthReady() {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 1. Restore session from storage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsReady(true);
    });

    // 2. Listen for subsequent changes (sign in/out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // Don't await anything here to avoid deadlocks
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, isReady, isAuthenticated: isReady && !!user };
}
