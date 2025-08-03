import { createClient } from "@/utils/supabase/server";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import DynamicIcon from "@/components/DynamicIcon";
import { toDDMMYYYY } from "@/utils/prettyDates";
import { notFound } from "next/navigation";

interface Client {
  id: string;
  name: string;
  // ... cualquier otro campo de la tabla de clientes
}

interface Project {
  id: string;
  client_id: string;
  name: string;
  description: string;
  created_at: string;
  icon?: string;
  clients: Client | null; // Objeto del cliente anidado
}

interface Props {
  params: { slug: string };
}

// Función para obtener un único proyecto por su slug (ID)
async function fetchProject(slug: string): Promise<Project | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(`*, clients(*), tasks(*)`) // Obtenemos toda la info del proyecto y la del cliente asociado
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching project:", error.message);
    // Esto activará la página not-found.tsx de Next.js para una mejor UX
    notFound();
  }
  // data puede ser null si la tabla está vacía
  return data; 
}

export default async function Page({ params }: Props) {
  const { slug } = params;

  const queryClient = new QueryClient();

  // 1. Hacemos prefetch del proyecto específico usando una queryKey única
  await queryClient.prefetchQuery({
    // Usamos una key estática para la depuración
    queryKey: ["project-by-slug"],
    queryFn: () => fetchProject(slug),
  });

  // 2. Obtenemos los datos pre-cargados para usarlos en el renderizado del servidor
  const project = queryClient.getQueryData<Project | null>(["project-by-slug"]);

  // 3. Si el proyecto no se encuentra, la función de fetch lanzará un error
  // y Next.js mostrará la página de "no encontrado".
  if (!project) {
    console.log("Project Not Found. La tabla 'projects' podría estar vacía o RLS está bloqueando la consulta.");
    return <div>Project Not Found!</div>
  }

  return (
    <div className="min-h-screen">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Project Card */}
            <div className="lg:col-span-2">
              <Card className="transition-all duration-500 hover:shadow-lg bg-gradient-to-br from-yellow-300 to-yellow-400 border-0 text-yellow-900">
                <CardContent className="p-6">
                  {/* Header with icon and title */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <DynamicIcon
                        name={project.icon || "folder"}
                        className="w-4 h-4 text-yellow-800"
                      />
                    </div>
                    <h1 className="text-xl font-semibold">
                      {project.name}
                    </h1>
                  </div>

                  {/* Breadcrumb */}
                  <div className="text-yellow-800/70 text-sm mb-4">
                    {project.clients?.name
                      ? `${project.clients.name} / `
                      : "My Projects / "}
                    {project.name}
                  </div>

                  {/* Due date */}
                  <div className="flex items-center gap-2 mb-6">
                    <Calendar className="w-4 h-4 text-yellow-800/70" />
                    <span className="text-yellow-800/70 text-sm">
                      Creado el: {toDDMMYYYY(project.created_at)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-full max-w-xs">
                        <Progress value={66} className="h-2 bg-white/30" />
                      </div>
                      <span className="text-yellow-800/70 text-sm font-medium ml-4">
                        66% Completed
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline/Tasks Sidebar */}
            <div className="space-y-4">
              {/* Date Header */}
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">10</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">
                  March
                </div>
              </div>

              {/* Task List */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full mt-0.5 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    Conceptualization and Theme Ex...
                  </span>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full mt-0.5 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    Sketching and Ideation
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <Card className="p-4">
                <h3 className="font-bold mb-2">Descripción del Proyecto</h3>
                <p className="text-gray-700 mb-4">{project.description}</p>
                <pre>
                  <code>{JSON.stringify(project, null, 2)}</code>
                </pre>
              </Card>
            </div>
          </div>
        </div>
      </HydrationBoundary>
    </div>
  );
}
