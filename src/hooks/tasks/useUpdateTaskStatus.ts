import { updateTaskStatus } from "@/lib/api/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  const { mutate: updateTask } = useMutation({
    mutationFn: ({
      taskId,
      newStatus,
    }: {
      taskId: string;
      newStatus: string;
    }) => updateTaskStatus(taskId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", "tasks"] });
    },
    onError: (error) => {
      console.error("Error updating task status:", error);
    },
  });

  return { updateTask };
}
