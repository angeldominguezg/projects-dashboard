import { Calendar, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Props {
  params: { slug: string };
}

function Page({ params }: Props) {
  const { slug } = params;

  return (
    <div className="min-h-screen">
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Project Card */}
          <div className="lg:col-span-2">
            <Card className="transition-all duration-500 hover:shadow-lg bg-gradient-to-br from-yellow-300 to-yellow-400 border-0">
              <CardContent className="px-6">
                {/* Header with icon and title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Circle className="w-4 h-4 text-yellow-800" />
                  </div>
                  <h1 className="text-xl font-semibold text-yellow-900">
                    Hajime Illustration Projects
                  </h1>
                </div>

                {/* Breadcrumb */}
                <div className="text-yellow-800/70 text-sm mb-4">
                  My Project / Hajime Illustration Projects
                </div>

                {/* Due date */}
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-4 h-4 text-yellow-800/70" />
                  <span className="text-yellow-800/70 text-sm">
                    Due date : Mar 10 2024
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

          {/* Timeline/Tasks Sidebar */}
          <div className="space-y-4">
            {/* Date Header */}
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">10</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">
                March
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full mt-0.5 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm leading-relaxed">
                  Conceptualization and Theme Ex...
                </span>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full mt-0.5 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm leading-relaxed">
                  Sketching and Ideation
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            Project page [SLUG HERE]
            <div>
              <p>Slug: {slug}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
