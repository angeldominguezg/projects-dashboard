'use client'

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import {DataTable} from "./DataTable";
import { columns, type Project } from "./Columns";

async function fetchProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("projects").select("*");

  if (error) {
    console.error(error);
    throw new Error("Projects data could not be loaded");
  }
  return data || [];
}

export default function ProjectsDataTableWrapper() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data available</div>;

  return <DataTable data={data} columns={columns} />;
}
