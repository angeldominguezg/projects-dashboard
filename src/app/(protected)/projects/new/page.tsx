import { ProjectForm } from "@/components/Forms/ProjectForm";

function NewProject() {
  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">
        New <span className="text-red-500">Project</span>
      </h1>

      <div className="max-w-md mx-auto">
        <ProjectForm />
      </div>
    </div>
  );
}

export default NewProject;