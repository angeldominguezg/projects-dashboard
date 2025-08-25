import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon, CircleCheck, Flame, Snowflake } from "lucide-react";
import { TASK_PRIORITY } from "@/utils/constants";
import { cn } from "@/lib/utils";

interface TaskPriorityBadgeProps {
  priority: string;
  className?: string;
}

function TaskPriorityBadge({ priority, className }: TaskPriorityBadgeProps) {
  const selectedPriority = TASK_PRIORITY.find(
    (item) => item.id === priority
  );

  if (!selectedPriority) {
    return null; // Or return a default badge
  }

  return (
    <Badge
      variant="secondary"
      className={cn("text-white", className)}
      style={{ backgroundColor: selectedPriority.color }}
    >
      {selectedPriority.id === 'low' && <Snowflake className="mr-1 h-3 w-3"/>}
      {selectedPriority.id === 'medium' && <CircleCheck  className="mr-1 h-3 w-3"/>}
      {selectedPriority.id === 'high' && <BadgeCheckIcon className="mr-1 h-3 w-3" />}
      {selectedPriority.id === 'critical' && <Flame className="mr-1 h-3 w-3"/>}
      {selectedPriority.name}
    </Badge>
  );
}

export default TaskPriorityBadge;
