/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader } from "@/components/Loader"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Users, FolderKanban, CheckSquare } from "lucide-react"
import QuickActions from "@/components/QuickActions"

interface DashboardData {
  projectSummary: { status: string; count: number }[]
  taskSummary: { status: string; count: number }[]
  userCount: number
  teamCount: number
  projectCount: number
  taskCount: number
  recentProjects: any[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard")
        if (!response.ok) throw new Error("Failed to fetch dashboard data")
        const dashboardData = await response.json()
        setData(dashboardData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
        <Loader size="lg" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="bg-white text-red-600 p-8 rounded-2xl shadow-2xl max-w-md">
          <h2 className="text-3xl font-bold mb-4">Error</h2>
          <p className="text-gray-600">Failed to load dashboard data. Please try again later.</p>
        </div>
      </div>
    )
  }

  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const totalProjects = data.projectCount
  const totalTasks = data.taskCount

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 sm:p-12">
            <header className="mb-12">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome, Admin!</h1>
              <p className="text-xl text-gray-600">
                Today is {formattedDate} - {formattedTime}
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <SummaryCard
                title="Total Users"
                value={data.userCount}
                icon={<Users className="h-8 w-8 text-blue-500" />}
                color="bg-blue-100"
              />
              <SummaryCard
                title="Total Teams"
                value={data.teamCount}
                icon={<Users className="h-8 w-8 text-green-500" />}
                color="bg-green-100"
              />
              <SummaryCard
                title="Total Projects"
                value={totalProjects}
                icon={<FolderKanban className="h-8 w-8 text-purple-500" />}
                color="bg-purple-100"
              />
              <SummaryCard
                title="Total Tasks"
                value={totalTasks}
                icon={<CheckSquare className="h-8 w-8 text-orange-500" />}
                color="bg-orange-100"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <ChartSection title="Project Status" data={data.projectSummary} dataKey="status" valueKey="count" />
              <ChartSection title="Task Status" data={data.taskSummary} dataKey="status" valueKey="count" />
            </div>

            <QuickActions />

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Recent Projects</h2>
              </div>
              <div className="p-6">
                <ul className="divide-y divide-gray-200">
                  {data.recentProjects.map((project) => (
                    <li key={project.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <FolderKanban className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{project.name}</p>
                          <p className="text-sm text-gray-500 truncate">{project.description}</p>
                        </div>
                        <div>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}
                          >
                            {project.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  icon,
  color,
}: { title: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div
      className={`${color} p-6 rounded-2xl shadow-lg transition duration-300 ease-in-out hover:shadow-xl transform hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="bg-white p-3 rounded-full shadow-md">{icon}</div>
      </div>
    </div>
  )
}

function ChartSection({
  title,
  data,
  dataKey,
  valueKey,
}: { title: string; data: any[]; dataKey: string; valueKey: string }) {
  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={dataKey} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={valueKey} fill="#3B82F6">
              {data.map((entry, index) => (
                <Bar key={`cell-${index}`} fill={colors[index % colors.length]} dataKey={""} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}



function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "planned":
      return "bg-yellow-100 text-yellow-800"
    case "in_progress":
      return "bg-blue-100 text-blue-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "on_hold":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

