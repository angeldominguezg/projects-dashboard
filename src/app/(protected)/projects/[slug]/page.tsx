import { createClient } from "@/utils/supabase/server";
import { getProjectBySlug, Project } from "@/lib/api/projects";
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
  const { slug } = params;

  const queryClient = new QueryClient();
  const supabase = createClient();

  // 1. Hacemos prefetch del proyecto específico usando una queryKey única
  await queryClient.prefetchQuery({
    // Una queryKey dinámica es mejor para evitar colisiones de caché
    queryKey: ["project", slug],
    queryFn: () => getProjectBySlug(supabase, slug),
  });

  // 2. Obtenemos los datos pre-cargados para usarlos en el renderizado del servidor
  const project = queryClient.getQueryData<Project | null>(["project", slug]);

  // 3. Si el proyecto no se encuentra, la función de fetch lanzará un error
  // y Next.js mostrará la página de "no encontrado".
  if (!project) {
    // Esta comprobación es una salvaguarda. getProjectBySlug ya llama a notFound()
    // si hay un error o no se encuentra el proyecto.
    return null;
  }

  return (
    <div className="min-h-screen">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProjectDetailView slug={slug} />
      </HydrationBoundary>
    </div>
  );
}
