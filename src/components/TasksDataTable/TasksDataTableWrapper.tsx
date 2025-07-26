'use client'

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import {DataTable} from "./DataTable";
import { columns, type Task } from "./Columns";

async function fetchTasks(): Promise<Task[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("tasks").select("*");

  if (error) {
    console.error(error);
    throw new Error("Tasks data could not be loaded");
  }
  return data || [];
}

export default function TasksDataTableWrapper() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data available</div>;

  return <DataTable data={data} columns={columns} />;
}
