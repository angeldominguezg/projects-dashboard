// import TestTableSupabase from "@/components/test/TestTableSupabase";
import { DataTable } from "@/components/PaymentsDataTable/DataTable";
import { columns, Payment } from "@/components/PaymentsDataTable/Columns";


async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "d9f8e7c6",
      amount: 250,
      status: "success",
      email: "john.doe@example.com",
    },
    {
      id: "b5a4c3d2",
      amount: 150,
      status: "pending",
      email: "jane.smith@example.com",
    },
    {
      id: "e1f2g3h4",
      amount: 320,
      status: "processing",
      email: "sam.wilson@example.com",
    },
    {
      id: "i5j6k7l8",
      amount: 80,
      status: "failed",
      email: "patricia.jones@example.com",
    },
    {
      id: "m9n0o1p2",
      amount: 500,
      status: "success",
      email: "michael.brown@example.com",
    },
    {
      id: "q3r4s5t6",
      amount: 75,
      status: "pending",
      email: "linda.davis@example.com",
    },
    {
      id: "u7v8w9x0",
      amount: 210,
      status: "processing",
      email: "robert.miller@example.com",
    },
    {
      id: "y1z2a3b4",
      amount: 45,
      status: "success",
      email: "barbara.garcia@example.com",
    },
    {
      id: "c5d6e7f8",
      amount: 180,
      status: "failed",
      email: "william.rodriguez@example.com",
    },
    {
      id: "g9h0i1j2",
      amount: 600,
      status: "pending",
      email: "susan.martinez@example.com",
    },
  ];
}

export default async function DashboardPage() {

  const data = await getData();

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">
        Welcome to <span className="text-red-500">TEST AREA</span>
      </h1>
      {/* <TestTableSupabase /> */}
      <h2>Testing Payments Datatable</h2>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
