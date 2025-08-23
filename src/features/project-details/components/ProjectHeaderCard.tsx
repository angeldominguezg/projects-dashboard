import DynamicIcon from "@/components/DynamicIcon";
import { Card, CardContent } from "@/components/ui/card";
import { toDDMMYYYY } from "@/utils/prettyDates";
import { Progress } from "@radix-ui/react-progress";
import { Calendar } from "lucide-react";

interface ProjectHeaderCardProps {
  clients: {
    name: string;
  } | null;
  name: string;
  icon: string | undefined;
  createdAt: string;
}


function ProjectHeaderCard({ clients, name, icon, createdAt }: ProjectHeaderCardProps) {
  return (
    <div>
      <div className="lg:col-span-2">
        <Card className="transition-all duration-500 hover:shadow-lg bg-gradient-to-br from-yellow-300 to-yellow-400 border-0 text-yellow-900">
          <CardContent className="p-6">
            {/* Header with icon and title */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <DynamicIcon
                  name={icon || "folder"}
                  className="w-4 h-4 text-yellow-800"
                />
              </div>
              <h1 className="text-xl font-semibold">{name}</h1>
            </div>

            {/* Breadcrumb */}
            <div className="text-yellow-800/70 text-sm mb-4">
              {clients?.name ? `${clients.name} / ` : "My Projects / "}
              {name}
            </div>

            {/* Due date */}
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-4 h-4 text-yellow-800/70" />
              <span className="text-yellow-800/70 text-sm">
                Creado el: {toDDMMYYYY(createdAt)}
              </span>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-full max-w-xs">
                  <Progress value={66} className="h-2 bg-white/30" />
                </div>
                <span className="text-yellow-800/70 text-sm font-medium ml-4">
                  66% Completed
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProjectHeaderCard;
