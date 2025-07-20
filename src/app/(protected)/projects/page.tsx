import { Project } from "@/components/ProjectsDataTable/Columns";
import { createClient } from "../../../utils/supabase/server"; // Nota: usar versión server
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import ProjectsDataTableWrapper from "@/components/ProjectsDataTable/ProjectsDataTableWrapper";

async function fetchProjects(): Promise<Project[] | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase.from("projects").select("*");

  if (error) {
    console.error(error);
    throw new Error("Projects data could not be loaded");
  }
  return data;
}

export default async function ProjectsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">
        My <span className="text-red-500">Projects</span>
      </h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProjectsDataTableWrapper />
      </HydrationBoundary>
    </div>
  );
}