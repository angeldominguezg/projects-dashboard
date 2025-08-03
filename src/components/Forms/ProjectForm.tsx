"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, CalendarDays, DollarSign } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useClients } from "@/hooks/clients/useClients";

import { generateSlug } from "@/utils/helpers";
import { useSlugAvailability } from "@/hooks/useSlugAvailability";
import { useEffect, useState } from "react";

import IconSelector from "@/components/IconSelector";
import DynamicIcon, { iconExists } from "../DynamicIcon";



const formSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  client_id: z.string(),
  is_pinned: z.boolean(),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .refine(
      (val) => !val.startsWith("-") && !val.endsWith("-"),
      "Slug cannot start or end with a hyphen"
    ),
  status: z.enum(["planning", "in_progress", "completed", "on_hold"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  budget: z.string().optional(),
  start_date: z.string(),
  end_date: z.string().optional(),
  icon: z.string().optional(),
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
        status: data.status,
        priority: data.priority,
        budget: data.budget,
        start_date: data.start_date,
        end_date: data.end_date,
        created_at: new Date().toISOString(),
        icon: data.icon,
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
      status: "planning",
      priority: "medium",
      budget: "0.00",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      icon: "",
    },
  });

  const watchedName = form.watch("name");
  const watchedSlug = form.watch("slug");
  const selectedIcon = form.watch("icon");

  // Generar slug automáticamente basado en el nombre
  useEffect(() => {
    if (watchedName && !isSlugManuallyEdited) {
      const autoSlug = generateSlug(watchedName);
      form.setValue("slug", autoSlug);
    }
  }, [watchedName, isSlugManuallyEdited, form]);

  // Verificar disponibilidad del slug
  const { data: slugCheck, isLoading: checkingSlug } = useSlugAvailability(
    "projects",
    watchedSlug
  );

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
                  <span className="text-red-500 text-sm">
                    ❌ This slug is already taken
                  </span>
                )}
                {slugCheck?.isAvailable === true && (
                  <span className="text-green-500 text-sm">
                    ✅ This slug is available
                  </span>
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
          />
        )}

        {/* Status and Priority Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="planning">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Planning
                      </div>
                    </SelectItem>
                    <SelectItem value="in_progress">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        In Progress
                      </div>
                    </SelectItem>
                    <SelectItem value="completed">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Completed
                      </div>
                    </SelectItem>
                    <SelectItem value="on_hold">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        On Hold
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Current status of the project</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        Low
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        High
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        Urgent
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>How urgent is this project</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Budget */}
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget (Optional)</FormLabel>
              <FormControl>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="10000"
                    className="pl-9"
                    step="0.01"
                    min="0"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>Estimated project budget in USD</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dates Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="date" className="pl-9" {...field} />
                  </div>
                </FormControl>
                <FormDescription>When the project should begin</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date (Optional)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="date" className="pl-9" {...field} />
                  </div>
                </FormControl>
                <FormDescription>Expected completion date</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                <FormDescription>
                  Pin this project for quick access in the sidebar.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* icon selector */}
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <IconSelector
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              {selectedIcon && (
                <div className="flex items-center gap-2 mt-2 p-2 border rounded">
                  <span className="text-sm text-muted-foreground">
                    Preview:
                  </span>
                  <DynamicIcon name={selectedIcon} size={20} />
                  <span className="text-sm">{selectedIcon}</span>
                </div>
              )}
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
              "Create Project"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
