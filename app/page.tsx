/* eslint-disable @next/next/no-img-element */
import type React from "react"
import Link from "next/link"
import { CheckCircle, Users, Calendar, FileText } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b px-2 from-blue-50 to-white">
      {/* <Navbar /> */}
      <Hero />
      <Features />
      <Benefits />
      <Testimonial />
      <CTA />
      <Footer />
    </div>
  )
}



function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
        <div className="px-6 py-24 sm:py-32 lg:col-span-7 lg:px-0 lg:py-48 xl:col-span-6">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block xl:inline">Streamline Projects at</span>{" "}
              <span className="block text-blue-600 xl:inline">Kabarak University</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-lg">
              Empower your academic journey with our cutting-edge project management system. Collaborate seamlessly,
              track progress effortlessly, and achieve excellence together.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/auth/register"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Get started
              </Link>
              <Link
                href="/demo"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="relative lg:col-span-5 lg:-mr-8 xl:col-span-6">
          <div className="aspect-[3/2] h-full w-full lg:absolute lg:inset-0 lg:aspect-auto lg:h-full">
            <img
              className="absolute inset-0 w-full h-full object-cover bg-gray-50 rounded-l-2xl"
              src="/hero.jpg"
              alt="Students collaborating"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </div>
    </div>
  )
}

function Features() {
  const features = [
    {
      name: "Team Collaboration",
      description: "Work together seamlessly with intuitive tools for communication and file sharing.",
      icon: Users,
    },
    {
      name: "Task Management",
      description: "Organize and prioritize tasks with ease, ensuring nothing falls through the cracks.",
      icon: CheckCircle,
    },
    {
      name: "Scheduling",
      description: "Keep projects on track with powerful scheduling and timeline management features.",
      icon: Calendar,
    },
    {
      name: "Document Management",
      description: "Centralize all project documents for easy access and version control.",
      icon: FileText,
    },
  ]

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage your projects
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our comprehensive project management system is designed to meet the unique needs of Kabarak University
            students and faculty.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

function Benefits() {
  return (
    <div className="bg-blue-700">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white">Transform your academic projects</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <BenefitCard
            title="Boost Productivity"
            description="Streamline workflows and eliminate bottlenecks to get more done in less time."
          />
          <BenefitCard
            title="Enhance Collaboration"
            description="Foster teamwork and communication among students and faculty members."
          />
          <BenefitCard
            title="Ensure Timely Completion"
            description="Keep projects on schedule with powerful tracking and reminder tools."
          />
        </div>
      </div>
    </div>
  )
}

function BenefitCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-blue-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-8">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <p className="mt-2 text-base text-blue-200">{description}</p>
      </div>
    </div>
  )
}

function Testimonial() {
  return (
    <div className="bg-white pt-16 lg:py-24">
      <div className="pb-16 bg-blue-600 lg:pb-0 lg:z-10 lg:relative">
        <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="relative lg:-my-8">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1/2 bg-white lg:hidden" />
            <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:p-0 lg:h-full">
              <div className="aspect-w-10 aspect-h-6 rounded-xl shadow-xl overflow-hidden sm:aspect-w-16 sm:aspect-h-7 lg:aspect-none lg:h-full">
                <img
                  className="object-cover lg:h-full lg:w-full"
                  src="/test.jpg"
                  alt="Student giving testimonial"
                />
              </div>
            </div>
          </div>
          <div className="mt-12 lg:m-0 lg:col-span-2 lg:pl-8">
            <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:px-0 lg:py-20 lg:max-w-none">
              <blockquote>
                <div>
                  <svg
                    className="h-12 w-12 text-white opacity-25"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="mt-6 text-2xl font-medium text-white">
                    This project management system has revolutionized how our team collaborates on research projects.
                    It&apos;s intuitive, powerful, and has significantly improved our productivity.
                  </p>
                </div>
                <footer className="mt-6">
                  <p className="text-base font-medium text-white">Sarah Muthoni</p>
                  <p className="text-base font-medium text-blue-100">Final Year Student, Computer Science</p>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CTA() {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block">Ready to dive in?</span>
          <span className="block text-blue-600">Start your project management journey today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Link
              href="auth/register"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Get started
            </Link>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
            >
              Request a demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Facebook</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
          </a>

          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Twitter</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>

          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">GitHub</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-base text-gray-400">
            &copy; 2025 Kabarak University Project Management. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

