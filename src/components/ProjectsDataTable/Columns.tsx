"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Project = {
  id: string;
  client_id: string;
  name: string;
  description: string;
  created_at: string;
};

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
  },
];
