'use client'

import { TaskForm } from '@/components/Forms/TaskForm'

export default function NewTaskPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">New Task</h1>
      <TaskForm />
    </div>
  )
}
