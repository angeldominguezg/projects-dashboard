'use client';

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

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useProjects } from "@/hooks/projects/useProjects";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Task name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  project_id: z.string(),
});

type FormData = z.infer<typeof formSchema>;

async function createTaskInSupabase(data: FormData) {
  const supabase = createClient();

  const { data: newTask, error } = await supabase
    .from("tasks")
    .insert([
      {
        name: data.name,
        description: data.description,
        project_id: data.project_id,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return newTask;
}

export function TaskForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: projects, isLoading: isLoadingProjects } = useProjects();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      project_id: "",
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: createTaskInSupabase,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully", {
        description: `${data.name} has been added to your tasks.`,
      });
      form.reset();
      router.push("/tasks");
    },
    onError: (error: Error) => {
      toast.error("Failed to create task", {
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  async function onSubmit(values: FormData) {
    await createTaskMutation.mutateAsync(values);
  }

  const isLoading = createTaskMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name</FormLabel>
              <FormControl>
                <Input placeholder="Task name" {...field} />
              </FormControl>
              <FormDescription>The name of the task.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Description</FormLabel>
              <FormControl>
                <Input placeholder="Task description" {...field} />
              </FormControl>
              <FormDescription>
                A brief description of the task.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="project_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoadingProjects}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                The project this task belongs to.
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
              "Create Task"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
