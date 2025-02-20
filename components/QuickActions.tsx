/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Link from 'next/link';
import { Users, FolderKanban, Plus, Calendar, Settings, Bell, FileText, Home } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      title: 'Teams',
      description: 'Manage your teams',
      icon: <Users className="h-6 w-6" />,
      href: '/teams/new',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      title: 'Projects',
      description: 'Create new projects',
      icon: <FolderKanban className="h-6 w-6" />,
      href: '/projects/new',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      title: 'Tasks',
      description: 'Manage tasks',
      icon: <FileText className="h-6 w-6" />,
      href: '/tasks',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    // {
    //   title: 'Calendar',
    //   description: 'View schedule',
    //   icon: <Calendar className="h-6 w-6" />,
    //   href: '/calendar',
    //   color: 'bg-orange-500',
    //   hoverColor: 'hover:bg-orange-600'
    // },
    {
      title: 'Notifications',
      description: 'Check updates',
      icon: <Bell className="h-6 w-6" />,
      href: '/notifications',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    },
    {
      title: 'Home',
      description: 'Return to home',
      icon: <Home className="h-6 w-6" />,
      href: '/',
      color: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
        <p className="text-gray-600">Access frequently used features</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <Link 
            key={index}
            href={action.href}
            className="group block"
          >
            <div className="p-4 rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-lg group-hover:-translate-y-1">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${action.color} ${action.hoverColor} transition-colors duration-300`}>
                  <div className="text-white">
                    {action.icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;