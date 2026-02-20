import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      setUserId(session.user.id);

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!data);
      setIsLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      check();
    });
    check();

    return () => subscription.unsubscribe();
  }, []);

  return { isAdmin, isLoading, userId };
}
