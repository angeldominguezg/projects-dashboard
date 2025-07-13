import TestTableSupabase from "@/components/test/TestTableSupabase";

export default function ClientsPage() {

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">
        My <span className="text-red-500">Clients</span> 
      </h1>
      {/* <TestTable /> */}
      <TestTableSupabase />
    </div>
  );
}