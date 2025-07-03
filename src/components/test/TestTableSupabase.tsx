"use client";
// This is a test whit React Query fetching Data
import { createClient } from "../../utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { smartTimeAgo } from "@/utils/timeAgo";

type Client = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  created_at: string;
};

async function fetchClients(): Promise<Client[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("clients").select("*");

  if (error) {
    console.error(error);
    throw new Error("Clients data could not be loaded");
  }
  return data;
}

function TestTableSupabase() {
  const {
    isLoading,
    error,
    data: clients,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {/* <pre>{JSON.stringify(clients, null, 2)}</pre> */}
      <Table>
        <TableCaption>A list of your clients.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>User Id</TableHead>
            <TableHead>Client Name</TableHead>
            <TableHead>Client Email</TableHead>
            <TableHead>Client Created On</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients?.map((client, key) => (
            <TableRow key={key}>
              <TableCell>{client.id.split("-")[0]}...</TableCell>
              <TableCell>{client.user_id.split("-")[0]}...</TableCell>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>
                <p>
                  {format(new Date(client.created_at), "dd/MM/yyyy", {
                    locale: es,
                  })}{" "}
                  <br />
                  <span className="text-xs">
                    {smartTimeAgo(client.created_at)}
                  </span>
                </p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default TestTableSupabase;
