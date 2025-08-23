import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { getProjectBySlug } from "@/lib/api/projects";

export function useProjectBySlug(slug: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["projects"],
    // Pasamos una función que llama a nuestro servicio de API
    queryFn: () => getProjectBySlug(supabase, slug),
  });
}
