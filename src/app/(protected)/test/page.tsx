import TestTable from "@/components/test/TestTable";
import TestTableSupabase from "@/components/test/TestTableSupabase";

export default function DashboardPage() {

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">
        Welcome to <span className="text-red-500">TEST AREA</span> 
      </h1>
      {/* <TestTable /> */}
      <TestTableSupabase />
    </div>
  );
}
