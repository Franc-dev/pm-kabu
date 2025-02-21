import { useState, useEffect } from "react"
import { Loader } from "@/components/Loader"
import TaskActions from "@/components/task-actions"

// interface Task {
//   id: string
//   title: string
//   description?: string
//   status: "planned" | "in_progress" | "completed" | "on_hold"
//   priority: "urgent" | "high" | "medium" | "low"
//   dueDate?: string
//   assigneeId?: string
//   assignee?: {
//     name: string
//     avatarUrl?: string
//   }
// }
interface Task {
  id: string
  title: string
  description?: string
  status: "planned" | "in_progress" | "completed" | "on_hold"
  priority: "urgent" | "high" | "medium" | "low"
  dueDate?: string
  assigneeId?: string
  assignee?: {
    name: string
    avatarUrl?: string
  }
}

interface TeamMember {
  id: string
  userId: string
  role: string
  user: {
    name: string
    avatarUrl?: string
  }
}

interface TaskBoardProps {
  id: string
}

type StatusColumns = {
  [K in Task["status"]]: Task[]
}

interface StatusColorMap {
  [key: string]: string
}

interface PriorityStyleMap {
  [key: string]: string
}

export default function TaskBoard({ id }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/projects/${id}/tasks`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to fetch tasks")
      setTasks(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch tasks"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch(`/api/projects/${id}/team`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to fetch team members")
      setTeamMembers(data)
    } catch (error) {
      console.error("Failed to fetch team members:", error)
    }
  }

  useEffect(() => {
    if (id) {
      fetchTasks()
      fetchTeamMembers()
    }
  }, [id])

  const statusColumns: StatusColumns = {
    planned: tasks.filter((task) => task.status === "planned"),
    in_progress: tasks.filter((task) => task.status === "in_progress"),
    completed: tasks.filter((task) => task.status === "completed"),
    on_hold: tasks.filter((task) => task.status === "on_hold"),
  }

  const getStatusColor = (status: Task["status"]): string => {
    const colors: StatusColorMap = {
      planned: "bg-purple-50 border-purple-200",
      in_progress: "bg-blue-50 border-blue-200",
      completed: "bg-green-50 border-green-200",
      on_hold: "bg-gray-50 border-gray-200",
    }
    return colors[status] || "bg-gray-50 border-gray-200"
  }

  const getPriorityStyles = (priority: Task["priority"]): string => {
    const styles: PriorityStyleMap = {
      urgent: "bg-red-100 text-red-800",
      high: "bg-orange-100 text-orange-800",
      medium: "bg-blue-100 text-blue-800",
      low: "bg-green-100 text-green-800",
    }
    return styles[priority] || "bg-gray-100 text-gray-800"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader size="md" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 p-4">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => fetchTasks()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 h-full">
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-min">
          {(Object.entries(statusColumns) as [Task["status"], Task[]][]).map(([status, taskList]) => (
            <div
              key={status}
              className={`rounded-xl border p-4 ${getStatusColor(status)} transition-all duration-200 hover:shadow-md w-[280px] flex-shrink-0`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium capitalize">{status.replace("_", " ")}</h3>
                <span className="px-2 py-1 bg-white rounded-full text-sm text-gray-600">{taskList.length}</span>
              </div>

              <div className="space-y-3">
                {taskList.map((task: Task) => (
                  <div key={task.id}>
                    <div
                      onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                      {task.description && (
                        <p className="text-[0.8rem] text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyles(task.priority)}`}
                        >
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs text-gray-500">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {task.assignee && (
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <span className="truncate">Assigned to: {task.assignee.name}</span>
                        </div>
                      )}
                    </div>
                    
                    {selectedTask === task.id && (
                      <div className="mt-2">
                        <TaskActions
                          taskId={task.id}
                          id={id}
                          currentStatus={task.status}
                          currentAssigneeId={task.assigneeId}
                          teamMembers={teamMembers}
                          onUpdate={fetchTasks}
                        />
                      </div>
                    )}
                  </div>
                ))}

                {taskList.length === 0 && (
                  <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-dashed">
                    <p className="text-sm">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}