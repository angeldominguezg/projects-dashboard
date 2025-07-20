"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react"; // Para el loading spinner

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type FormData = z.infer<typeof formSchema>;

// Función para crear el cliente en Supabase
async function createClientInSupabase(data: FormData & { user_id: string }) {
  const supabase = createClient();

  const { data: newClient, error } = await supabase
    .from("clients")
    .insert([
      {
        name: data.name,
        email: data.email,
        user_id: data.user_id,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return newClient;
}

export function ProfileForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  // const [isGettingUser, setIsGettingUser] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // 2. Mutation for creating client
  const createClientMutation = useMutation({
    mutationFn: createClientInSupabase,
    onSuccess: (data) => {
      // Invalidar y refetch la lista de clientes
      queryClient.invalidateQueries({ queryKey: ["clients"] });

      // Mostrar toast de éxito
      toast.success("Client created successfully", {
        description: `${data.name} has been added to your clients.`,
      });

      // Reset el formulario
      form.reset();

      // TODO: Opcional: redirigir a la página de clientes
      // TODO: Con el usuario filtrado en la lista para poder hacer alguna seleccion
      router.push("/clients");
    },
    onError: (error: Error) => {
      toast.error("Failed to create client", {
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  // 3. Define a submit handler.
  async function onSubmit(values: FormData) {
    // console.log("OnSubmit", values)
    try {
      // setIsGettingUser(true);

      // Obtener el usuario actual
      // const user = await getCurrentUser();

      // Crear el cliente con el user_id
      await createClientMutation.mutateAsync({
        ...values,
        user_id: "2af8c3bd-1524-4815-9967-3088ba74d1dc",
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "User not authenticated"
      ) {
        toast.error("Authentication required", {
          description: "Please login to create clients.",
        });
        // router.push("/login");
      }
    } finally {
      // setIsGettingUser(false);
    }
  }

  const isLoading = createClientMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Full Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>The client full name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Email</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>
                The contact email of your client.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="mb-2"
            disabled={isLoading}
          >
            Back
          </Button>
          <Button type="submit" disabled={isLoading} className="mb-2">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Client"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
