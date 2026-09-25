'use client';

import Link from 'next/link';
import { useProjectStore } from '@/lib/project-store';
import { Plus, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProjectsPage() {
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-slate-50' : 'text-slate-900'}`}>My Projects</h2>
          <p className={`mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>View and manage your projects</p>
        </div>
        <Link
          href="/client/projects/new"
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
        >
          <Plus className="w-5 h-5" />
          New Project
        </Link>
      </div>

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
        <div className="grid gap-6">
          {projects.map(project => (
            <Link
              key={project.id}
              href={`/client/projects/${project.id}`}
              className={`block p-6 rounded-xl border-2 transition group ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 hover:border-indigo-500 hover:shadow-lg'
                  : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className={`text-xl font-bold transition ${
                    darkMode
                      ? 'text-slate-100 group-hover:text-indigo-400'
                      : 'text-slate-900 group-hover:text-indigo-600'
                  }`}>
                    {project.name}
                  </h3>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {project.description}
                  </p>
                </div>
                <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  project.status === 'ready_for_development'
                    ? darkMode
                      ? 'bg-yellow-900/30 text-yellow-300'
                      : 'bg-yellow-100 text-yellow-800'
                    : project.status === 'developer_review'
                      ? darkMode
                        ? 'bg-blue-900/30 text-blue-300'
                        : 'bg-blue-100 text-blue-800'
                      : darkMode
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-slate-100 text-slate-800'
                }`}>
                  {project.status === 'ready_for_development'
                    ? 'Ready'
                    : project.status === 'developer_review'
                      ? 'In Review'
                      : 'Draft'}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Progress</span>
                    <span className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                      {project.progress}%
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-violet-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <ArrowRight className={`w-5 h-5 ml-4 transition ${
                  darkMode ? 'text-indigo-400' : 'text-indigo-600'
                } group-hover:translate-x-1`} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
