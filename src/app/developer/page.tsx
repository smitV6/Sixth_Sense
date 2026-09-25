'use client';

import Link from 'next/link';
import { useProjectStore } from '@/lib/project-store';
import { AlertCircle, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';

export default function DeveloperDashboard() {
  const currentDeveloperId = useProjectStore(state => state.currentDeveloperId);
  const projects = useProjectStore(state => state.projects);

  // Filter projects for current developer
  const myProjects = projects.filter(p => p.sentToDeveloperId === currentDeveloperId && p.status === 'in_development');

  // Calculate stats for current developer only
  const activeProjects = myProjects.length;
  const totalRequirements = myProjects.reduce((sum, p) => sum + p.coreRequirements.length + p.addedRequirements.length, 0);
  const completedRequirements = myProjects.reduce(
    (sum, p) => sum + [...p.coreRequirements, ...p.addedRequirements].filter(r => r.status === 'completed').length,
    0,
  );
  const totalCommits = myProjects.reduce((sum, p) => sum + (p.commits?.length || 0), 0);
  const totalScopeAlerts = myProjects.reduce((sum, p) => sum + (p.scopeAlerts?.length || 0), 0);

  // Get insights from current developer's projects with scope alerts
  const scopeAlertInsights = myProjects
    .filter(p => (p.scopeAlerts?.length || 0) > 0)
    .flatMap(p =>
      p.scopeAlerts!.filter(alert => alert.severity === 'high' || alert.severity === 'critical').map(alert => ({
        id: alert.id,
        title: `${p.name}: ${alert.feature} detected as scope addition`,
        description: alert.description,
        severity: alert.severity,
      })),
    )
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Intelligence Hub CTA */}
      <Link
        href="/developer/intelligence"
        className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-2xl p-8 text-white hover:shadow-2xl transition"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6" />
              <span className="text-sm font-bold opacity-90">NEW FEATURE</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Sixth Sense Intelligence Hub</h2>
            <p className="text-indigo-100 text-lg mb-4">
              See how requirements connect to development activity and user feedback. Get AI-powered recommendations for what to build next.
            </p>
            <div className="flex items-center gap-2 text-indigo-100 font-semibold group">
              Explore Intelligence
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center w-32 h-32 opacity-10">
            <Sparkles className="w-32 h-32" />
          </div>
        </div>
      </Link>

      <div>
        <p className="text-slate-600 text-lg">Here&apos;s what Sixth Sense noticed across your projects.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-600 font-medium">Active Projects</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{activeProjects}</div>
          <div className="text-xs text-slate-500 mt-1">In development</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-600 font-medium">Requirements Progress</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">
            {completedRequirements}/{totalRequirements}
          </div>
          <div className="text-xs text-slate-500 mt-1">{Math.round((completedRequirements / totalRequirements) * 100)}% complete</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-600 font-medium">Git Commits</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{totalCommits}</div>
          <div className="text-xs text-slate-500 mt-1">Development activity</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-600 font-medium">Scope Alerts</div>
          <div className="text-3xl font-bold text-orange-600 mt-2">{totalScopeAlerts}</div>
          <div className="text-xs text-slate-500 mt-1">Issues to review</div>
        </div>
      </div>

      {scopeAlertInsights.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Scope Alerts</h2>
          <div className="grid gap-4">
            {scopeAlertInsights.map(insight => {
              const Icon = insight.severity === 'critical' ? AlertCircle : AlertTriangle;
              const bgColor = insight.severity === 'critical' ? 'bg-red-50' : 'bg-orange-50';
              const borderColor = insight.severity === 'critical' ? 'border-l-red-500' : 'border-l-orange-500';
              const textColor = insight.severity === 'critical' ? 'text-red-900' : 'text-orange-900';

              return (
                <div key={insight.id} className={`p-6 rounded-xl border-l-4 ${bgColor} ${borderColor}`}>
                  <div className={`font-bold ${textColor} flex items-center gap-2`}>
                    <Icon className="w-5 h-5" />
                    <span className="uppercase text-sm">{insight.severity}</span>
                  </div>
                  <p className={`${textColor} mt-2`}>{insight.title}</p>
                  <p className={`${textColor} mt-1 text-sm opacity-75`}>{insight.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Active Projects</h2>
        <div className="grid gap-4">
          {myProjects.length === 0 ? (
            <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
              <p className="text-slate-600 mb-4">No active projects</p>
              <p className="text-sm text-slate-500">Go to Client Requests to accept a project</p>
            </div>
          ) : (
            myProjects.map(project => {
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

                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                {/* Quick stats */}
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

                {/* Alerts if any */}
                {pendingAlerts > 0 && (
                  <div className="flex items-center gap-2 text-orange-700 text-sm bg-orange-50 p-2 rounded">
                    <AlertTriangle className="w-4 h-4" />
                    {pendingAlerts} scope alert{pendingAlerts > 1 ? 's' : ''} pending review
                  </div>
                )}
              </Link>
            );
            })
          )}
        </div>
      </div>
    </div>
  );
}
