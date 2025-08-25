"use client";

import type { DragEndEvent } from "@dnd-kit/core";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/ui/shadcn-io/kanban";
import { useMemo, useState } from "react";
import { Task } from "@/lib/api/tasks";
import { TASK_STATUSES } from "@/utils/constants";
import { useUpdateTaskStatus } from "@/hooks/tasks/useUpdateTaskStatus";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import TaskPriorityBadge from "@/components/TaskPriorityBadge";



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
  const [showArchived, setShowArchived] = useState(false);
  const { updateTask } = useUpdateTaskStatus();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

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
          const newStatus = TASK_STATUSES.find(
            (status) => status.id === overContainer
          );
          toast.success(`Task status changed to "${newStatus?.name || overContainer}".`);
        },
      }
    );
  };

  const visibleColumns = useMemo(
    () =>
      showArchived
        ? TASK_STATUSES
        : TASK_STATUSES.filter((status) => status.id !== "archive"),
    [showArchived]
  );

  const visibleFeatures = useMemo(
    () =>
      showArchived
        ? features
        : features.filter((task) => task.status !== "archive"),
    [features, showArchived]
  );

  return (
    <>
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => setShowArchived(!showArchived)}
        >
          {showArchived ? "Hide Archived" : "Show Archived"}
        </Button>
      </div>
      <KanbanProvider
        columns={visibleColumns}
        data={visibleFeatures}
        onDragEnd={handleDragEnd}
      >
        {(column) => (
          <KanbanBoard id={column.id} key={column.id}>
            <KanbanHeader>
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
                <span>{column.name}</span>
              </div>
            </KanbanHeader>
            <KanbanCards id={column.id}>
              {(feature: (typeof features)[number]) => (
                <KanbanCard
                  // 3. La prop 'column' ahora es dinámica.
                  column={feature.status}
                  id={feature.id}
                  key={feature.id}
                  name={feature.name}
                >
                  <div>
                    <TaskPriorityBadge priority={feature.priority} />
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <p className="m-0 flex-1 text-sm font-bold">
                        {feature.name}
                      </p>
                       <p className="m-0 flex-1 text-xd font-light">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <p className="m-0 text-muted-foreground text-xs">
                    {/* TODO: FORMAT DATES */}
                    {feature.created_at} - {feature.completed_at}
                    {/* {shortDateFormatter.format(feature.startAt)} -{" "}
                      {dateFormatter.format(feature.endAt)} */}
                  </p>
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>
    </>
  );
}

export default ProjectKanban;
