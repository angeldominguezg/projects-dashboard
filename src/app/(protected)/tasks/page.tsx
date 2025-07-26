'use client'

import TasksDataTableWrapper from '@/components/TasksDataTable/TasksDataTableWrapper'

export default function TasksPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Tasks</h1>
      <TasksDataTableWrapper />
    </div>
  )
}
