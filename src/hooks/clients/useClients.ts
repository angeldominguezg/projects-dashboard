import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

async function fetchClients() {
  const supabase = createClient();
  const { data, error } = await supabase.from("clients").select("*");

  if (error) {
    throw new Error("Failed to fetch clients");
  }

  return data || [];
}

export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });
}
