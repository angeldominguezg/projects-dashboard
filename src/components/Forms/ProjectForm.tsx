"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useClients } from "@/hooks/clients/useClients"

import { generateSlug } from "@/utils/helpers";
import { useSlugAvailability } from "@/hooks/useSlugAvailability";
import { useEffect, useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  client_id: z.string(),
  is_pinned: z.boolean(),
  slug: z.string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .refine((val) => !val.startsWith('-') && !val.endsWith('-'), 
      "Slug cannot start or end with a hyphen"),
});

type FormData = z.infer<typeof formSchema>;

async function createProjectInSupabase(data: FormData) {
  const supabase = createClient();

  const { data: newProject, error } = await supabase
    .from("projects")
    .insert([
      {
        name: data.name,
        description: data.description,
        client_id: data.client_id,
        is_pinned: data.is_pinned,
        slug: data.slug,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return newProject;
}

export function ProjectForm({ clientID }) {

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: clients, isLoading: isLoadingClients } = useClients();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      is_pinned: false,
      client_id: clientID ? clientID : "",
    },
  });

  const watchedName = form.watch("name");
  const watchedSlug = form.watch("slug");

  // Generar slug automáticamente basado en el nombre
  useEffect(() => {
    if (watchedName && !isSlugManuallyEdited) {
      const autoSlug = generateSlug(watchedName);
      form.setValue("slug", autoSlug);
    }
  }, [watchedName, isSlugManuallyEdited, form]);

    // Verificar disponibilidad del slug
  const {data: slugCheck, isLoading: checkingSlug } = useSlugAvailability('projects', watchedSlug);


  const createProjectMutation = useMutation({
    mutationFn: createProjectInSupabase,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully", {
        description: `${data.name} has been added to your projects.`,
      });
      form.reset();
      router.push("/projects");
    },
    onError: (error: Error) => {
      toast.error("Failed to create project", {
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  async function onSubmit(values: FormData) {
    await createProjectMutation.mutateAsync(values);
  }

  const isLoading = createProjectMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Project name" {...field} />
              </FormControl>
              <FormDescription>The name of the project.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Slug</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute left-3 top-2 text-sm text-muted-foreground">
                    /projects/
                  </div>
                  <Input 
                    placeholder="new-website-development"
                    className="pl-20"
                    {...field}
                    onChange={(e) => {
                      setIsSlugManuallyEdited(true);
                      field.onChange(e.target.value.toLowerCase());
                    }}
                  />
                  {checkingSlug && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription className="flex items-center gap-2">
                {slugCheck?.isAvailable === false && (
                  <span className="text-red-500 text-sm">❌ This slug is already taken</span>
                )}
                {slugCheck?.isAvailable === true && (
                  <span className="text-green-500 text-sm">✅ This slug is available</span>
                )}
                {!checkingSlug && watchedSlug && (
                  <span className="text-muted-foreground">
                    Preview: /projects/{watchedSlug}
                  </span>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Input placeholder="Project description" {...field} />
              </FormControl>
              <FormDescription>
                A brief description of the project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {!clientID && (
        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoadingClients}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                The client this project belongs to.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />)}

         <FormField
          control={form.control}
          name="is_pinned"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Pinned project to sidebar</FormLabel>
                <FormDescription>Pin this project for quick access in the sidebar.</FormDescription>
              </div>
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
              "Create Project"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
