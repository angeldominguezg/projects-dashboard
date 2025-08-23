interface ProjectTimelineProps {
  tasks: string[] | null;
}


function ProjectTimeline({tasks}:  ProjectTimelineProps) {

  console.log("Project Timeline ", tasks)

  return (
    <div>
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
  );
}

export default ProjectTimeline;
