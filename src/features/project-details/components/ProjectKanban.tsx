"use client";

import type { DragEndEvent } from "@dnd-kit/core";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/ui/shadcn-io/kanban";
import { useMemo } from "react";
import { Task } from "@/lib/api/tasks";
import { TASK_STATUSES } from "@/utils/constants";
import { useUpdateTaskStatus } from "@/hooks/tasks/useUpdateTaskStatus";
import { toast } from "sonner";

interface ProjectKanbanProps {
  tasks: Task[];
}

function ProjectKanban({ tasks }: ProjectKanbanProps) {
  const features = useMemo(
    () =>
      tasks.map((task) => ({
        ...task,
        column: task.status,
      })),
    [tasks]
  );
  const { updateTask } = useUpdateTaskStatus();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log("active.id", active.id)
    console.log("over.id", over?.id)
    console.log("over", over)

    if (!over) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) {
      return;
    }

    // Obtiene la columna original de la tarjeta arrastrada.
    const activeContainer = active.data.current?.column;
    // Determina la columna de destino. Si se suelta sobre una tarjeta, usa la columna de esa tarjeta.
    // Si se suelta en una columna vacía, usa el id de la columna.
    const overContainer = over.data.current?.column || overId;

    // Solo ejecuta la mutación si la tarjeta realmente cambió de columna.
    if (activeContainer === overContainer) return;

    updateTask(
      { taskId: String(activeId), newStatus: String(overContainer) },
      {
        onSuccess: () => {
          toast.success("Task status updated successfully");
        },
      }
    );
  };

  return (
    <KanbanProvider
      columns={TASK_STATUSES}
      data={features}
      onDragEnd={handleDragEnd}
    >
      {(TASK_STATUSES) => (
        <KanbanBoard id={TASK_STATUSES.id} key={TASK_STATUSES.id}>
          <KanbanHeader>
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: TASK_STATUSES.color }}
              />
              <span>{TASK_STATUSES.name}</span>
            </div>
          </KanbanHeader>
          <KanbanCards id={TASK_STATUSES.id}>
            {(feature: (typeof features)[number]) => (
              <KanbanCard
                // 3. La prop 'column' ahora es dinámica.
                column={feature.status}
                id={feature.id}
                key={feature.id}
                name={feature.name}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="m-0 flex-1 font-medium text-sm">
                      {feature.name}
                    </p>
                  </div>
                </div>
                <p className="m-0 text-muted-foreground text-xs">
                  {/* {shortDateFormatter.format(feature.startAt)} -{" "}
                    {dateFormatter.format(feature.endAt)} */}
                </p>
              </KanbanCard>
            )}
          </KanbanCards>
        </KanbanBoard>
      )}
    </KanbanProvider>
  );
}

export default ProjectKanban;
