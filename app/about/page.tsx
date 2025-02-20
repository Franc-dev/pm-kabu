import type React from "react"
import Image from "next/image"
import { Users, BookOpen, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">About Us</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 mb-6">
                  At Kabarak University Project Management, our mission is to empower students and faculty with
                  cutting-edge tools to streamline collaboration, enhance productivity, and drive academic excellence
                  through effective project management.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
                <p className="text-gray-600 mb-6">
                  Founded in 2023, our project management system was born out of a need to simplify complex academic
                  projects. What started as a small initiative by a group of Computer Science students has grown into a
                  comprehensive platform used across various departments at Kabarak University.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <FeatureCard
                    icon={<Users className="h-8 w-8 text-blue-500" />}
                    title="Collaborative"
                    description="Foster teamwork and communication among students and faculty."
                  />
                  <FeatureCard
                    icon={<BookOpen className="h-8 w-8 text-blue-500" />}
                    title="Learning-Focused"
                    description="Designed to enhance the academic experience and project-based learning."
                  />
                  <FeatureCard
                    icon={<Award className="h-8 w-8 text-blue-500" />}
                    title="Excellence-Driven"
                    description="Committed to helping students and faculty achieve outstanding results."
                  />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <TeamMember name="Dr. James Muthoni" role="Project Lead" image="https://xsgames.co/randomusers/assets/avatars/male/2.jpg" />
                  <TeamMember name="John Kamau" role="Lead Developer" image="https://xsgames.co/randomusers/assets/avatars/male/53.jpg" />
                  <TeamMember name="Jacob Wanjiru" role="UX Designer" image="https://xsgames.co/randomusers/assets/avatars/male/64.jpg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function TeamMember({ name, role, image }: { name: string; role: string; image: string }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Image
        src={image || "/placeholder.svg"}
        alt={name}
        width={300}
        height={300}
        className="w-full h-48 object-contain"
      />
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{name}</h3>
        <p className="text-gray-600">{role}</p>
      </div>
    </div>
  )
}

