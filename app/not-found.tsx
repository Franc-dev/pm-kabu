import React from 'react';
import Link from 'next/link';
import { Home, Users, FolderKanban, FileText, HelpCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const quickLinks = [
    {
      icon: <Home className="h-5 w-5" />,
      label: 'Return Home',
      href: '/',
      description: 'Go back to dashboard',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Teams',
      href: '/teams',
      description: 'View all teams',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      icon: <FolderKanban className="h-5 w-5" />,
      label: 'Projects',
      href: '/projects',
      description: 'Browse projects',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: 'Documentation',
      href: '/docs',
      description: 'Read our guides',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: 'Support',
      href: '/support',
      description: 'Get help',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative">
          {/* Large 404 Background Text */}
          <h1 className="text-[180px] font-extrabold text-gray-900/10 select-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            404
          </h1>
          
          {/* Content Overlay */}
          <div className="relative z-10">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-4">
              Error 404
            </p>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
              Page not found
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. Perhaps you&apos;ve mistyped the URL or the page has been moved.
            </p>

            {/* Quick Links Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg backdrop-filter">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Quick Links to Help You Navigate
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="group block"
                  >
                    <div className="p-4 rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-lg group-hover:-translate-y-1">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${link.color} ${link.hoverColor} transition-colors duration-300`}>
                          <div className="text-white">
                            {link.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                            {link.label}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {link.description}
                          </p>
                        </div>
                        <ArrowLeft className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transform transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}