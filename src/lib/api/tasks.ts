import { supabase } from "../supabaseClient";


export interface Task {
  id: string;
  project_id: string;
  name: string;
  description: string;
  status: string;
  created_at: string; 
}

export async function updateTaskStatus(
  taskId: string,
  newStatus: string
): Promise<Task | null> {

  const { data, error } = await supabase
    .from("tasks")
    .update({ status: newStatus })
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    console.error("Error updating task status:", error.message);
    return null;
  }

  return data;
}