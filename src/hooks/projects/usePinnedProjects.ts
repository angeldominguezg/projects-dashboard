import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

async function fetchPinnedProjects() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_pinned", true);

    if (error) {
      console.error(error);
    throw new Error("Projects data could not be loaded");
  }
  return data || [];
}

export function usePinnedProjects() {
  return useQuery({
    queryKey: ["projects-pinned"],
    queryFn: fetchPinnedProjects,
  });
}
