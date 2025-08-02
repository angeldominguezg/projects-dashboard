import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";



// Hook para verificar si un slug está disponible
export function useSlugAvailability(table: string, slug: string, debounceMs = 500) {
  const [debouncedSlug, setDebouncedSlug] = useState(slug);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSlug(slug), debounceMs);
    return () => clearTimeout(timer);
  }, [slug, debounceMs]);

  const supabase = createClient();
  
  return useQuery({
    queryKey: ["slug-availability", debouncedSlug],
    queryFn: async () => {
      if (!debouncedSlug || debouncedSlug.length < 3) return null;
      
      const { data, error } = await supabase
        .from(table)
        .select("slug")
        .eq("slug", debouncedSlug)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return { isAvailable: !data, slug: debouncedSlug };
    },
    enabled: !!debouncedSlug && debouncedSlug.length >= 3,
  });
}
