import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { getPinnedProjects } from "@/lib/api/projects";

export function usePinnedProjects() {
  const supabase = createClient();
  return useQuery({
    queryKey: ["projects-pinned"],
    queryFn: () => getPinnedProjects(supabase),
  });
}
