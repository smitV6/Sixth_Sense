'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useProjectStore } from '@/lib/project-store';
import { MOCK_DEVELOPERS } from '@/lib/mock-developers';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  children?: { href: string; label: string }[];
}

export function DashboardShell({ children, userRole, userName }: { children: React.ReactNode; userRole: 'client' | 'developer'; userName: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeveloperMenu, setShowDeveloperMenu] = useState(false);
  const pathname = usePathname();
  const currentDeveloperId = useProjectStore(state => state.currentDeveloperId);
  const setCurrentDeveloper = useProjectStore(state => state.setCurrentDeveloper);

  const currentDeveloper = MOCK_DEVELOPERS.find(d => d.id === currentDeveloperId) || MOCK_DEVELOPERS[0];

  const clientNav: NavItem[] = [
    { href: '/client', label: 'Dashboard', icon: '📊' },
    { href: '/client/projects', label: 'My Projects', icon: '📁' },
    { href: '/client/projects/new', label: 'Create Project', icon: '➕' },
    { href: '/client/developers', label: 'Find Developers', icon: '👥' },
  ];

  const developerNav: NavItem[] = [
    { href: '/developer', label: 'Dashboard', icon: '📊' },
    { href: '/developer/intelligence', label: 'Intelligence Hub', icon: '🧠' },
    { href: '/developer/requests', label: 'Client Requests', icon: '📥' },
    { href: '/developer/projects', label: 'My Projects', icon: '📁' },
    {
      href: '/developer/my-product',
      label: 'My Product',
      icon: '📦',
      children: [
        { href: '/developer/my-product', label: 'Overview' },
        { href: '/developer/my-product/feedback', label: 'Feedback Center' },
        { href: '/developer/my-product/clusters', label: 'Clusters' },
        { href: '/developer/my-product/feature-requests', label: 'Feature Requests' },
        { href: '/developer/my-product/insights', label: 'AI Insights' },
        { href: '/developer/my-product/requirements', label: 'Requirements' },
      ],
    },
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
          {navItems.map(item => {
            const isActive = pathname === item.href;
            const isSectionActive = item.children ? pathname.startsWith(item.href) : isActive;

            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
                    isSectionActive ? 'bg-violet-600/90 text-white' : 'hover:bg-slate-700'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span>
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </span>
                  {item.children && <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSectionActive ? 'rotate-180' : ''}`} />}
                </Link>

                {item.children && isSectionActive && (
                  <div className="ml-6 mt-1 space-y-0.5 border-l border-slate-700 pl-3">
                    {item.children.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          pathname === child.href ? 'text-violet-300 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-700'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
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

          {userRole === 'developer' && (
            <div className="relative">
              <button
                onClick={() => setShowDeveloperMenu(!showDeveloperMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
              >
                <span className="text-sm font-medium text-slate-900">Viewing as: {currentDeveloper.name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showDeveloperMenu ? 'rotate-180' : ''}`} />
              </button>

              {showDeveloperMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                  {MOCK_DEVELOPERS.map(dev => (
                    <button
                      key={dev.id}
                      onClick={() => {
                        setCurrentDeveloper(dev.id);
                        setShowDeveloperMenu(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm border-b border-slate-100 last:border-b-0 transition ${
                        dev.id === currentDeveloperId
                          ? 'bg-indigo-50 font-semibold text-indigo-700'
                          : 'hover:bg-slate-50 text-slate-900'
                      }`}
                    >
                      <div className="font-medium">{dev.name}</div>
                      <div className="text-xs text-slate-600">{dev.title}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
