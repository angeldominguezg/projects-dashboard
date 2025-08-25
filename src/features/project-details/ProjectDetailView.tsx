'use client';

import  ProjectHeaderCard  from './components/ProjectHeaderCard';
import  ProjectTimeline  from './components/ProjectTimeline';
import  ProjectDescription  from './components/ProjectDescription';
import { useProjectBySlug } from '@/hooks/projects/useProjectBySlug';
import ProjectKanban from './components/ProjectKanban';

interface ProjectDetailViewProps {
  slug: string;
}

export function ProjectDetailView({ slug }: ProjectDetailViewProps) {

  const { data: project, isLoading, error } = useProjectBySlug(slug);

  if (isLoading) return <div>Cargando detalles del proyecto...</div>;
  if (error) return <div>Error al cargar el proyecto.</div>;
  if (!project) return <div>Proyecto no encontrado.</div>;

  const { icon, name, description, clients, created_at, tasks} = project;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <ProjectHeaderCard
          clients={clients}
          name={name}
          icon={icon}
          createdAt={created_at}
          description={description}
        />
      </div>

      {/* Project Kanban */}
      <div className="lg:col-span-3">
        <ProjectKanban tasks={tasks} />
      </div>

      {/* <div className="space-y-4"><ProjectTimeline tasks={tasks} /></div> */}

      <div className="lg:col-span-3">
        {/* <ProjectDescription description={description} /> */}
        {/* Para depuración */}
        <pre className="mt-4">
          {/* <code>{JSON.stringify(project, null, 2)}</code> */}
        </pre>
      </div>
    </div>
  );
}