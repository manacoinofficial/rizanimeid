import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * Logs a row in `public.visits` for every navigation. Safe for anonymous users.
 */
export function useVisitTracker() {
  const location = useLocation();
  const lastPath = useRef<string>("");

  useEffect(() => {
    const path = location.pathname + location.search;
    if (path === lastPath.current) return;
    lastPath.current = path;

    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from("visits").insert({
          path,
          user_id: user?.id ?? null,
          user_agent: navigator.userAgent.slice(0, 240),
        });
      } catch {
        // silent
      }
    })();
  }, [location.pathname, location.search]);
}