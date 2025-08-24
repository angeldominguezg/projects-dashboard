import { createClient } from "@/utils/supabase/server";
import { getProjectBySlug } from "@/lib/api/projects";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { ProjectDetailView } from "@/features/project-details/ProjectDetailView";

interface Props {
  params: { slug: string };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const queryClient = new QueryClient();
  const supabase = createClient();

  // 1. Hacemos prefetch del proyecto específico usando una queryKey única
  await queryClient.prefetchQuery({
    // Una queryKey dinámica es mejor para evitar colisiones de caché
    queryKey: ["project", slug],
    queryFn: () => getProjectBySlug(supabase, slug),
  });

  return (
    <div className="min-h-screen">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProjectDetailView slug={slug} />
      </HydrationBoundary>
    </div>
  );
}
