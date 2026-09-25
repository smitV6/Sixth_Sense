'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, LogOut } from 'lucide-react';

export function DashboardShell({ children, userRole, userName }: { children: React.ReactNode; userRole: 'client' | 'developer'; userName: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const clientNav = [
    { href: '/client', label: 'Dashboard', icon: '📊' },
    { href: '/client/projects', label: 'My Projects', icon: '📁' },
    { href: '/client/projects/new', label: 'Create Project', icon: '➕' },
    { href: '/client/developers', label: 'Find Developers', icon: '👥' },
    { href: '/client/suggestions', label: 'AI Suggestions', icon: '💡' },
    { href: '/client/messages', label: 'Messages', icon: '💬' },
    { href: '/client/profile', label: 'Profile', icon: '⚙️' },
  ];

  const developerNav = [
    { href: '/developer', label: 'Dashboard', icon: '📊' },
    { href: '/developer/requests', label: 'Client Requests', icon: '📥' },
    { href: '/developer/projects', label: 'My Projects', icon: '📁' },
    { href: '/developer/products', label: 'My Products', icon: '📦' },
    { href: '/developer/github', label: 'GitHub', icon: '🔗' },
    { href: '/developer/feedback', label: 'User Feedback', icon: '💬' },
    { href: '/developer/insights', label: 'AI Insights', icon: '🧠' },
    { href: '/developer/scope-monitor', label: 'Scope Monitor', icon: '📈' },
    { href: '/developer/assistant', label: 'AI Assistant', icon: '🤖' },
    { href: '/developer/settings', label: 'Settings', icon: '⚙️' },
  ];

  const navItems = userRole === 'client' ? clientNav : developerNav;

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } md:w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-6 border-b border-slate-700">
          <Link href="/" className="text-xl font-bold text-white">
            Sixth Sense
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors font-medium text-sm"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 font-medium text-sm">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-2xl font-bold text-slate-900">
              Good morning, {userName} 👋
            </h1>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
