'use client';

import Link from 'next/link';
import { useProjectStore } from '@/lib/project-store';
import { AlertTriangle } from 'lucide-react';

export default function DeveloperProjects() {
  const currentDeveloperId = useProjectStore(state => state.currentDeveloperId);
  const projects = useProjectStore(state => state.projects);

  const myProjects = projects.filter(p => p.sentToDeveloperId === currentDeveloperId && p.status === 'in_development');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Projects</h2>
        <p className="text-slate-600 mt-1">Projects assigned to you for development</p>
      </div>

      {myProjects.length === 0 ? (
        <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
          <p className="text-slate-600 mb-4">No projects assigned yet</p>
          <p className="text-sm text-slate-500">Accepted projects will appear here</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {myProjects.map(project => {
            const allRequirements = [...project.coreRequirements, ...project.addedRequirements];
            const completedCount = allRequirements.filter(r => r.status === 'completed').length;
            const pendingAlerts = (project.scopeAlerts || []).filter(a => a.status === 'open').length;

            return (
              <Link
                key={project.id}
                href={`/developer/projects/${project.id}`}
                className="bg-white p-6 rounded-xl border border-slate-200 hover:border-violet-300 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{project.name}</h3>
                    <p className="text-slate-600 text-sm mt-1">{project.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-violet-600">{project.progress}%</div>
                    <div className="text-xs text-slate-500">Progress</div>
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-slate-200 mb-4">
                  <div>
                    <div className="text-xs text-slate-600">Requirements</div>
                    <div className="text-lg font-bold text-slate-900">
                      {completedCount}/{allRequirements.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600">Commits</div>
                    <div className="text-lg font-bold text-slate-900">{project.commits?.length || 0}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600">Health</div>
                    <div className="text-lg font-bold text-green-600">{project.developmentHealth?.score || 0}%</div>
                  </div>
                </div>

                {pendingAlerts > 0 && (
                  <div className="flex items-center gap-2 text-orange-700 text-sm bg-orange-50 p-2 rounded">
                    <AlertTriangle className="w-4 h-4" />
                    {pendingAlerts} scope alert{pendingAlerts > 1 ? 's' : ''} pending review
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
