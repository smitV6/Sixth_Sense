'use client';

import Link from 'next/link';
import { useProjectStore } from '@/lib/project-store';
import { Plus, ArrowRight } from 'lucide-react';

export default function ProjectsPage() {
  const projects = useProjectStore(state => state.projects);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Projects</h2>
          <p className="text-slate-600 mt-1">View and manage your projects</p>
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
        <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
          <p className="text-slate-600 mb-4">No projects yet</p>
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
              className="block bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-indigo-300 hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition">{project.name}</h3>
                  <p className="text-slate-600 text-sm mt-1">{project.description}</p>
                </div>
                <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  project.status === 'ready_for_development'
                    ? 'bg-yellow-100 text-yellow-800'
                    : project.status === 'developer_review'
                      ? 'bg-blue-100 text-blue-800'
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
                    <span className="text-slate-600">Progress</span>
                    <span className="font-semibold text-slate-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-violet-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-indigo-600 ml-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
