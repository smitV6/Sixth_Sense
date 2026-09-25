'use client';

import { useState } from 'react';
import { useProjectStore } from '@/lib/project-store';
import {
  BarChart3,
  CheckCircle2,
  Circle,
  AlertTriangle,
  GitBranch,
  Package,
  Activity,
  Clock,
  TrendingUp,
  Zap,
} from 'lucide-react';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectWorkspace({ params }: ProjectPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  // Handle async params
  if (!resolvedParams) {
    params.then(p => setResolvedParams(p));
    return <div className="p-8 text-slate-600">Loading project...</div>;
  }

  const getProject = useProjectStore(state => state.getProject);
  const project = getProject(resolvedParams.id);

  if (!project) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Project not found</h2>
        <p className="text-slate-600">The project you're looking for doesn't exist.</p>
      </div>
    );
  }

  const allRequirements = [...project.coreRequirements, ...project.addedRequirements];
  const completedRequirements = allRequirements.filter(r => r.status === 'completed').length;
  const completionPercentage = Math.round((completedRequirements / allRequirements.length) * 100);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'requirements', label: 'Requirements', icon: CheckCircle2 },
    { id: 'commits', label: 'Development', icon: GitBranch },
    { id: 'intelligence', label: 'GitHub Intelligence', icon: Zap },
    { id: 'scope', label: 'Scope Monitor', icon: AlertTriangle },
    { id: 'addons', label: 'Add-ons', icon: Package },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
          <p className="text-slate-600 mt-1">{project.description}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-600">Progress</div>
          <div className="text-3xl font-bold text-violet-600">{project.progress}%</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-violet-600 to-indigo-600 h-3 rounded-full transition-all"
          style={{ width: `${project.progress}%` }}
        />
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-600 font-medium">Requirements</div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {completedRequirements}/{allRequirements.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">{completionPercentage}% complete</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-600 font-medium">Commits</div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{project.commits?.length || 0}</div>
          <div className="text-xs text-slate-500 mt-1">Development activity</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-600 font-medium">Scope Alerts</div>
          <div className="text-2xl font-bold text-orange-600 mt-2">{project.scopeAlerts?.length || 0}</div>
          <div className="text-xs text-slate-500 mt-1">Issues to review</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-600 font-medium">Health</div>
          <div className="text-2xl font-bold text-green-600 mt-2">
            {project.developmentHealth?.score || 0}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Project health</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 border-b-2 transition font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'border-violet-600 text-violet-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Project Summary</h3>
              <p className="text-slate-600 mb-4">{project.summary}</p>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <div className="text-sm text-slate-600">Target Users</div>
                  <div className="font-semibold text-slate-900">{project.targetUsers || 'Not specified'}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Platform</div>
                  <div className="font-semibold text-slate-900 capitalize">{project.platform?.replace('_', ' ')}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Deadline</div>
                  <div className="font-semibold text-slate-900 capitalize">{project.deadline?.replace(/_/g, ' ')}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Repository</div>
                  <div className="font-semibold text-slate-900 text-sm">{project.gitRepository || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Health Indicator */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Development Health</h3>
              <div className="flex items-center gap-6 mb-4">
                <div className="text-6xl font-bold text-green-600">
                  {project.developmentHealth?.score || 0}%
                </div>
                <div className="space-y-2 flex-1">
                  {project.developmentHealth?.reasons.slice(0, 3).map((reason, idx) => (
                    <div key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Project Timeline</h3>
              <div className="space-y-3">
                {project.timeline.map(event => (
                  <div key={event.id} className="flex items-center gap-3">
                    {event.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                    )}
                    <span className={event.completed ? 'text-slate-900 font-medium' : 'text-slate-600'}>
                      {event.label}
                    </span>
                    {event.timestamp && (
                      <span className="text-xs text-slate-500 ml-auto">
                        {new Date(event.timestamp).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REQUIREMENTS TAB */}
        {activeTab === 'requirements' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Core Requirements</h3>
              <div className="space-y-3">
                {project.coreRequirements.map(req => (
                  <div key={req.id} className="flex items-start gap-4 p-3 rounded-lg border border-slate-200">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{req.name}</div>
                      <p className="text-sm text-slate-600 mt-1">{req.description}</p>
                      <div className="flex gap-2 mt-2">
                        {req.priority && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            req.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : req.priority === 'medium'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-blue-100 text-blue-700'
                          }`}>
                            {req.priority}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${
                          req.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : req.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-100 text-slate-700'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {project.addedRequirements.length > 0 && (
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4">Added Requirements</h3>
                <div className="space-y-3">
                  {project.addedRequirements.map(req => (
                    <div key={req.id} className="flex items-start gap-4 p-3 rounded-lg border border-slate-200">
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{req.name}</div>
                        <p className="text-sm text-slate-600 mt-1">{req.description}</p>
                        <div className="flex gap-2 mt-2">
                          {req.priority && (
                            <span className={`text-xs px-2 py-1 rounded ${
                              req.priority === 'high'
                                ? 'bg-red-100 text-red-700'
                                : req.priority === 'medium'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-blue-100 text-blue-700'
                            }`}>
                              {req.priority}
                            </span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded ${
                            req.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : req.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-700'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* DEVELOPMENT TAB */}
        {activeTab === 'commits' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">Commit Timeline</h3>
            {project.commits && project.commits.length > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {project.commits.map(commit => (
                  <div key={commit.id} className="p-4 border border-slate-200 rounded-lg hover:border-violet-300 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{commit.message}</div>
                        <div className="text-sm text-slate-600 mt-1">
                          by {commit.developer} • {new Date(commit.timestamp).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                            {commit.filesChanged} files
                          </span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            +{commit.linesAdded}
                          </span>
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                            -{commit.linesRemoved}
                          </span>
                          {commit.aiClassification && (
                            <span className={`text-xs px-2 py-1 rounded ${
                              commit.aiClassification === 'core_feature'
                                ? 'bg-blue-100 text-blue-700'
                                : commit.aiClassification === 'bug_fix'
                                  ? 'bg-orange-100 text-orange-700'
                                  : commit.aiClassification === 'scope_addition'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-slate-100 text-slate-700'
                            }`}>
                              {commit.aiClassification.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      </div>
                      {commit.confidence && (
                        <div className="text-right">
                          <div className="text-xs text-slate-600">Confidence</div>
                          <div className="text-sm font-bold text-violet-600">{Math.round(commit.confidence * 100)}%</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600">No commits yet</p>
            )}
          </div>
        )}

        {/* GITHUB INTELLIGENCE TAB */}
        {activeTab === 'intelligence' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Requirement-to-Commit Mapping</h3>
              <div className="space-y-4">
                {allRequirements.slice(0, 5).map(req => {
                  const matchedCommits = project.commits?.filter(c => c.relatedRequirementId === req.id) || [];
                  return (
                    <div key={req.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-medium text-slate-900">{req.name}</div>
                          <div className="text-sm text-slate-600 mt-1">{req.description}</div>
                        </div>
                        <div className="text-right">
                          {req.status === 'completed' && (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          )}
                          {req.status === 'in_progress' && (
                            <Circle className="w-6 h-6 text-blue-600" />
                          )}
                          {req.status === 'pending' && (
                            <Circle className="w-6 h-6 text-slate-300" />
                          )}
                        </div>
                      </div>

                      {matchedCommits.length > 0 ? (
                        <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                          <div className="text-xs font-semibold text-slate-600">Matched Commits:</div>
                          {matchedCommits.map(commit => (
                            <div
                              key={commit.id}
                              className="text-xs p-2 bg-violet-50 border border-violet-200 rounded"
                            >
                              <div className="font-medium text-violet-900">{commit.message}</div>
                              <div className="text-violet-700 mt-1">
                                Confidence: {Math.round((commit.confidence || 0.85) * 100)}%
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500">
                          No commits matched yet
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {project.commits && project.commits.some(c => !c.relatedRequirementId) && (
              <div className="bg-white p-6 rounded-xl border border-amber-200 bg-amber-50">
                <h3 className="font-bold text-amber-900 mb-4">Unmatched Commits</h3>
                <div className="space-y-3">
                  {project.commits
                    .filter(c => !c.relatedRequirementId)
                    .slice(0, 5)
                    .map(commit => (
                      <div key={commit.id} className="p-3 bg-white border border-amber-200 rounded-lg">
                        <div className="font-medium text-slate-900">{commit.message}</div>
                        <div className="text-sm text-slate-600 mt-1">
                          {commit.developer} • {new Date(commit.timestamp).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-amber-700 mt-2">
                          This commit could not be automatically matched to a requirement. Review if it's part of scope.
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SCOPE MONITOR TAB */}
        {activeTab === 'scope' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">Scope Alerts</h3>
            {project.scopeAlerts && project.scopeAlerts.length > 0 ? (
              <div className="space-y-4">
                {project.scopeAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'critical'
                        ? 'border-l-red-500 bg-red-50'
                        : alert.severity === 'high'
                          ? 'border-l-orange-500 bg-orange-50'
                          : 'border-l-yellow-500 bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{alert.feature}</div>
                        <div className="text-sm text-slate-700 mt-1">{alert.description}</div>
                        <div className="text-sm text-slate-600 mt-2 italic">{alert.recommendation}</div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold px-3 py-1 rounded ${
                          alert.severity === 'critical'
                            ? 'bg-red-200 text-red-800'
                            : alert.severity === 'high'
                              ? 'bg-orange-200 text-orange-800'
                              : 'bg-yellow-200 text-yellow-800'
                        }`}>
                          {alert.severity}
                        </span>
                        <div className="text-xs text-slate-600 mt-2">{alert.status || 'open'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600">No scope alerts at this time</p>
            )}
          </div>
        )}

        {/* ADD-ONS TAB */}
        {activeTab === 'addons' && (
          <div className="space-y-4">
            {project.optionalAddOns.filter(a => a.status === 'added').length > 0 && (
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4">Approved Add-ons</h3>
                <div className="space-y-3">
                  {project.optionalAddOns
                    .filter(a => a.status === 'added')
                    .map(addon => (
                      <div key={addon.id} className="p-4 border border-green-200 bg-green-50 rounded-lg">
                        <div className="font-medium text-green-900">{addon.name}</div>
                        <p className="text-sm text-green-800 mt-1">{addon.description}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {project.optionalAddOns.filter(a => a.status === 'available').length > 0 && (
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4">Available Add-ons</h3>
                <div className="space-y-3">
                  {project.optionalAddOns
                    .filter(a => a.status === 'available')
                    .map(addon => (
                      <div key={addon.id} className="p-4 border border-slate-200 rounded-lg hover:border-violet-300">
                        <div className="font-medium text-slate-900">{addon.name}</div>
                        <p className="text-sm text-slate-600 mt-1">{addon.description}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === 'activity' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">Activity Timeline</h3>
            {project.activities && project.activities.length > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {project.activities.map(activity => (
                  <div key={activity.id} className="flex gap-4 pb-3 border-b border-slate-200 last:border-0">
                    <div className="flex-shrink-0">
                      {activity.type === 'requirement_update' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                      {activity.type === 'commit' && <GitBranch className="w-5 h-5 text-violet-600" />}
                      {activity.type === 'scope_alert' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                      {activity.type === 'deployment' && <Zap className="w-5 h-5 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{activity.label}</div>
                      <div className="text-sm text-slate-600 mt-1">
                        {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </div>
                      {activity.details?.description && (
                        <div className="text-sm text-slate-600 mt-1">{activity.details.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600">No activity yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
