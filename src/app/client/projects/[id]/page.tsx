'use client';

import { useProjectStore } from '@/lib/project-store';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const getProject = useProjectStore(state => state.getProject);
  const project = getProject(params.id);

  if (!project) {
    return <div className="text-center py-12">Project not found</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">{project.name}</h1>
        <p className="text-slate-600 mt-2">{project.description}</p>
        <div className="flex gap-4 mt-4">
          <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${
            project.status === 'ready_for_development'
              ? 'bg-yellow-100 text-yellow-800'
              : project.status === 'developer_review'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-slate-100 text-slate-800'
          }`}>
            {project.status === 'ready_for_development'
              ? 'Ready for Development'
              : project.status === 'developer_review'
                ? 'Developer Review'
                : 'Draft'}
          </div>
          <div className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg font-semibold text-sm">
            {project.progress}% Complete
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border-2 border-slate-200">
          <h2 className="font-bold text-slate-900 mb-4">Project Info</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-slate-600">Target Users</div>
              <div className="font-semibold text-slate-900">{project.targetUsers || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Platform</div>
              <div className="font-semibold text-slate-900 capitalize">{project.platform || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Deadline</div>
              <div className="font-semibold text-slate-900">{project.deadline?.replace(/_/g, ' ') || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 p-6 rounded-xl border-2 border-indigo-200">
          <h2 className="font-bold text-slate-900 mb-4">Project Health</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-700 font-medium">Requirements clarity</span>
                <span className="text-2xl font-bold text-indigo-600">{project.projectHealth.clarity}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 h-2 rounded-full"
                  style={{ width: `${project.projectHealth.clarity}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-slate-700 mt-4">{project.projectHealth.note}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Requirements</h2>
        <div className="space-y-3">
          {project.coreRequirements.map(req => (
            <div key={req.id} className="flex items-start gap-4 p-4 bg-white border-2 border-slate-200 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-slate-900">{req.name}</div>
                <p className="text-sm text-slate-600 mt-1">{req.description}</p>
              </div>
              <div className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">Core</div>
            </div>
          ))}
          {project.addedRequirements.map(req => (
            <div key={req.id} className="flex items-start gap-4 p-4 bg-white border-2 border-slate-200 rounded-xl">
              <AlertCircle className="w-6 h-6 text-violet-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-slate-900">{req.name}</div>
                <p className="text-sm text-slate-600 mt-1">{req.description}</p>
              </div>
              <div className="text-xs font-semibold text-violet-700 bg-violet-100 px-3 py-1 rounded-full">
                {req.priority?.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {project.timeline && project.timeline.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Project Timeline</h2>
          <div className="space-y-3">
            {project.timeline.map((event, i) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    event.completed ? 'bg-green-600 border-green-600' : 'border-slate-300'
                  }`}>
                    {event.completed && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  {i < project.timeline.length - 1 && <div className="w-0.5 h-12 bg-slate-200 mt-2" />}
                </div>
                <div className="pb-6">
                  <div className={`font-semibold ${event.completed ? 'text-slate-900' : 'text-slate-600'}`}>
                    {event.label}
                  </div>
                  {event.completed && <div className="text-sm text-green-600 mt-1">✓ Completed</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
