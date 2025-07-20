import { ProfileForm } from "@/components/Forms/ClientForm";

function NewClient() {
  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">
        New <span className="text-red-500">Client</span>
      </h1>

      <div className="max-w-md mx-auto">
        <ProfileForm />
      </div>
    </div>
  );
}

export default NewClient;
