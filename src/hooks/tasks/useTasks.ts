
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

async function fetchTasks() {
  const supabase = createClient();
  const { data, error } = await supabase.from("tasks").select("*");

  if (error) {
    console.error(error);
    throw new Error("Tasks data could not be loaded");
  }
  return data || [];
}

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
}
