"use client"

import type React from "react"
import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { logger } from "@/lib/logger"
import toast from "react-hot-toast"
import type { Task } from "@/src/db/schema"
import { Loader } from "@/components/Loader"

export default function NewTaskPage(props: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const params = use(props.params)
  const projectId = params.id

  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "planned",
    priority: "medium",
    dueDate: null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Special handling for dueDate
    if (name === 'dueDate') {
      setFormData(prev => ({ ...prev, [name]: value ? new Date(value) : null }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
  
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        }),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create task')
      }
  
      logger.info("Task created successfully", { task: data })
      toast.success("Task created successfully")
      router.push(`/projects/${projectId}`)
      router.refresh()
    } catch (error) {
      logger.error("Error creating task", { 
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      toast.error(error instanceof Error ? error.message : 'Failed to create task')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Task</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Task Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description ?? ''}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Describe the task"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="planned">Planned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader size="sm" className="mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Task"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}