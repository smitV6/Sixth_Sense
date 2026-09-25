'use client';

import Link from 'next/link';
import { useProjectStore } from '@/lib/project-store';

export default function ClientDashboard() {
  const projects = useProjectStore(state => state.projects);

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
        <p className="text-slate-600 text-lg">Let&apos;s turn your ideas into better products.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-600 font-medium">Active Projects</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{activeProjects}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-600 font-medium">Completed</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{completed}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-600 font-medium">Pending Suggestions</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{totalSuggestions}</div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Projects</h2>
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
          <div className="grid gap-4">
            {projects.map(project => (
              <div key={project.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-indigo-300 transition">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{project.name}</h3>
                    <p className="text-slate-600">{project.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">{project.progress}%</div>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <Link
                  href={`/client/projects/${project.id}`}
                  className="inline-block mt-4 px-4 py-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
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
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Sixth Sense Insights</h2>
          <div className="grid gap-4">
            {insights.map(insight => (
              <div
                key={insight.id}
                className={`p-6 rounded-xl border-l-4 ${
                  insight.type === 'warning'
                    ? 'bg-yellow-50 border-l-yellow-500'
                    : 'bg-blue-50 border-l-blue-500'
                }`}
              >
                <div className="font-bold text-slate-900">{insight.title}</div>
                <p className="text-slate-600 text-sm mt-1">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
