"use client";

import { ColumnDef } from "@tanstack/react-table";


export type Client = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  created_at: string;
};


export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
  },
];