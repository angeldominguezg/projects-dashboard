'use client'

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import {DataTable} from "./DataTable";
import { columns, type Client } from "./Columns";

async function fetchClients(): Promise<Client[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("clients").select("*");

  if (error) {
    console.error(error);
    throw new Error("Clients data could not be loaded");
  }
  return data || [];
}

export default function ClientsDataTableWrapper() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data available</div>;

  return <DataTable data={data} columns={columns} />;
}