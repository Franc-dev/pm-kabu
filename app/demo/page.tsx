/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from 'next/link';
import { Calendar, Users, FileText, CheckSquare } from 'lucide-react';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center">
      <header className="bg-white shadow-md w-full py-6 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Request a Demo</h1>
        <p className="mt-2 text-lg text-gray-600">Experience the future of project management</p>
      </header>
      <main className="w-full max-w-4xl px-6 py-10">
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Get a Personalized Demo</h2>
          <p className="mt-2 text-gray-600 text-center">
            Fill out the form below and we&apos;ll schedule a walkthrough of our project management platform.
          </p>
          <form className="mt-6 space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
              <select
                id="department"
                name="department"
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option>Computer Science</option>
                <option>Business Administration</option>
                <option>Engineering</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Additional Information</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tell us about your project management needs"
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300"
              >
                Request Demo
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
