"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProjectForm } from "../Forms/ProjectForm";

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
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <DialogTrigger>Add Project to Client</DialogTrigger>
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(row.original.email)
                }
              >
                Copy Client email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Client details</DropdownMenuItem>
              <DropdownMenuItem>View Projects</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Project for Client: {row.original.name} </DialogTitle>
              <DialogDescription>
                Description...
              </DialogDescription>
            </DialogHeader>
            <ProjectForm clientID={row.original.id} />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
