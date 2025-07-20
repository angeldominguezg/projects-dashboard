import { Client } from "@/components/ClientsDataTable/Columns";
import { createClient } from "../../../utils/supabase/server"; // Nota: usar versión server
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import ClientsDataTableWrapper from "@/components/ClientsDataTable/ClientsDataTableWrapper";

async function fetchClients(): Promise<Client[] | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase.from("clients").select("*");

  if (error) {
    console.error(error);
    throw new Error("Clients data could not be loaded");
  }
  return data;
}

export default async function ClientsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">
        My <span className="text-red-500">Clients</span>
      </h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ClientsDataTableWrapper />
      </HydrationBoundary>
    </div>
  );
}
