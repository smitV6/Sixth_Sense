'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useProjectStore } from '@/lib/project-store';

export default function ClientDashboard() {
  const projects = useProjectStore(state => state.projects);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const activeProjects = projects.filter(p => p.status !== 'completed').length;
  const completed = projects.filter(p => p.status === 'completed').length;
  const totalSuggestions = projects.reduce((sum, p) => sum + p.suggestions.filter(s => s.status === 'pending').length, 0);

  const insights = projects
    .filter(p => (p.scopeAlerts?.length || 0) > 0 || p.progress < 50)
    .slice(0, 3)
    .map(p => {
      if ((p.scopeAlerts?.length || 0) > 0) {
        return {
          id: `${p.id}-scope`,
          title: `${p.scopeAlerts!.length} potential scope addition${p.scopeAlerts!.length > 1 ? 's' : ''} detected in ${p.name}`,
          description: 'Review recent development activity to confirm these are approved.',
          type: 'warning' as const,
        };
      }
      return {
        id: `${p.id}-progress`,
        title: `${p.name} is ${p.progress}% complete`,
        description: 'Development is still in its early stages.',
        type: 'info' as const,
      };
    });

  return (
    <div className="space-y-8">
      <div>
        <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Let&apos;s turn your ideas into better products.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-6 rounded-xl border shadow-sm ${
          darkMode
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-slate-200'
        }`}>
          <div className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Active Projects
          </div>
          <div className={`text-3xl font-bold mt-2 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
            {activeProjects}
          </div>
        </div>
        <div className={`p-6 rounded-xl border shadow-sm ${
          darkMode
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-slate-200'
        }`}>
          <div className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Completed
          </div>
          <div className={`text-3xl font-bold mt-2 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
            {completed}
          </div>
        </div>
        <div className={`p-6 rounded-xl border shadow-sm ${
          darkMode
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-slate-200'
        }`}>
          <div className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Pending Suggestions
          </div>
          <div className={`text-3xl font-bold mt-2 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
            {totalSuggestions}
          </div>
        </div>
      </div>

      <div>
        <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-slate-50' : 'text-slate-900'}`}>
          Recent Projects
        </h2>
        {projects.length === 0 ? (
          <div className={`rounded-xl border-2 border-dashed p-12 text-center ${
            darkMode
              ? 'bg-slate-900 border-slate-700'
              : 'bg-slate-50 border-slate-300'
          }`}>
            <p className={`mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>No projects yet</p>
            <Link
              href="/client/projects/new"
              className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map(project => (
              <div key={project.id} className={`p-6 rounded-xl border transition ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 hover:border-indigo-500'
                  : 'bg-white border-slate-200 hover:border-indigo-300'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                      {project.name}
                    </h3>
                    <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                      {project.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                      {project.progress}%
                    </div>
                  </div>
                </div>
                <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <Link
                  href={`/client/projects/${project.id}`}
                  className={`inline-block mt-4 px-4 py-2 font-semibold text-sm transition ${
                    darkMode
                      ? 'text-indigo-400 hover:text-indigo-300'
                      : 'text-indigo-600 hover:text-indigo-700'
                  }`}
                >
                  View Project →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {insights.length > 0 && (
        <div>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-slate-50' : 'text-slate-900'}`}>
            Sixth Sense Insights
          </h2>
          <div className="grid gap-4">
            {insights.map(insight => (
              <div
                key={insight.id}
                className={`p-6 rounded-xl border-l-4 ${
                  insight.type === 'warning'
                    ? darkMode
                      ? 'bg-yellow-900/20 border-l-yellow-600'
                      : 'bg-yellow-50 border-l-yellow-500'
                    : darkMode
                      ? 'bg-blue-900/20 border-l-blue-600'
                      : 'bg-blue-50 border-l-blue-500'
                }`}
              >
                <div className={`font-bold ${
                  darkMode
                    ? insight.type === 'warning'
                      ? 'text-yellow-200'
                      : 'text-blue-200'
                    : 'text-slate-900'
                }`}>
                  {insight.title}
                </div>
                <p className={`text-sm mt-1 ${
                  darkMode
                    ? insight.type === 'warning'
                      ? 'text-yellow-300'
                      : 'text-blue-300'
                    : 'text-slate-600'
                }`}>
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
