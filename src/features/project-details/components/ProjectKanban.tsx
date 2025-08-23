"use client";

import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/ui/shadcn-io/kanban";
import { useState } from "react";
import { Task } from "@/lib/api/projects";
import { TASK_STATUSES } from "@/utils/constants";
  
// 1. Los IDs de las columnas deben ser estáticos y predecibles.
// const columns = [
//   { id: "planned", name: "Planned", color: "#6B7280" },
//   { id: "in-progress", name: "In Progress", color: "#F59E0B" },
//   { id: "revision", name: "Revision", color: "#4271e9" },
//   { id: "done", name: "Done", color: "#10B981" },
//   { id: "archive", name: "Archive", color: "#6B7280" },
// ];

interface ProjectKanbanProps {
  tasks: Task[];
}

function ProjectKanban({ tasks }: ProjectKanbanProps) {
  const tasksWithColumn = tasks.map((task) => ({
    ...task,
    column: task.status,
  }));

  const [features, setFeatures] = useState(tasksWithColumn);

  return (
    <KanbanProvider
      columns={TASK_STATUSES}
      data={features}
      onDataChange={setFeatures}
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
