'use client';

import { useEffect, useState } from 'react';
import { useProjectStore } from '@/lib/project-store';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const getProject = useProjectStore(state => state.getProject);
  const projects = useProjectStore(state => state.projects);

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const handleDarkModeChange = () => {
      setDarkMode(document.documentElement.classList.contains('dark'));
    };
    const observer = new MutationObserver(handleDarkModeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const project = getProject(params.id);

  if (!project) {
    return (
      <div className="text-center py-12">
        <div className={`mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Project not found</div>
        <div className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>ID: {params.id} | Available: {projects.length}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-4xl font-bold ${darkMode ? 'text-slate-50' : 'text-slate-900'}`}>{project.name}</h1>
        <p className={`mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{project.description}</p>
        <div className="flex gap-4 mt-4">
          <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${
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
              ? 'Ready for Development'
              : project.status === 'developer_review'
                ? 'Developer Review'
                : 'Draft'}
          </div>
          <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${
            darkMode
              ? 'bg-indigo-900/30 text-indigo-300'
              : 'bg-indigo-100 text-indigo-800'
          }`}>
            {project.progress}% Complete
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-xl border-2 ${
          darkMode
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-slate-200'
        }`}>
          <h2 className={`font-bold mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Project Info</h2>
          <div className="space-y-3">
            <div>
              <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Target Users</div>
              <div className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                {project.targetUsers || 'N/A'}
              </div>
            </div>
            <div>
              <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Platform</div>
              <div className={`font-semibold capitalize ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                {project.platform || 'N/A'}
              </div>
            </div>
            <div>
              <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Deadline</div>
              <div className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                {project.deadline?.replace(/_/g, ' ') || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border-2 ${
          darkMode
            ? 'bg-indigo-900/20 border-indigo-800/30'
            : 'bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-200'
        }`}>
          <h2 className={`font-bold mb-4 ${darkMode ? 'text-indigo-200' : 'text-slate-900'}`}>Project Health</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className={`font-medium ${darkMode ? 'text-indigo-200' : 'text-slate-700'}`}>
                  Requirements clarity
                </span>
                <span className={`text-2xl font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                  {project.projectHealth.clarity}%
                </span>
              </div>
              <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                <div
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 h-2 rounded-full"
                  style={{ width: `${project.projectHealth.clarity}%` }}
                />
              </div>
            </div>
            <p className={`text-sm mt-4 ${darkMode ? 'text-indigo-200' : 'text-slate-700'}`}>
              {project.projectHealth.note}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-slate-50' : 'text-slate-900'}`}>Requirements</h2>
        <div className="space-y-3">
          {project.coreRequirements.map(req => (
            <div key={req.id} className={`flex items-start gap-4 p-4 border-2 rounded-xl ${
              darkMode
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200'
            }`}>
              <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className={`font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  {req.name}
                </div>
                <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {req.description}
                </p>
              </div>
              <div className={`text-xs font-semibold px-3 py-1 rounded-full ${
                darkMode
                  ? 'text-green-300 bg-green-900/30'
                  : 'text-green-700 bg-green-100'
              }`}>
                Core
              </div>
            </div>
          ))}
          {project.addedRequirements.map(req => (
            <div key={req.id} className={`flex items-start gap-4 p-4 border-2 rounded-xl ${
              darkMode
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200'
            }`}>
              <AlertCircle className="w-6 h-6 text-violet-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className={`font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  {req.name}
                </div>
                <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {req.description}
                </p>
              </div>
              <div className={`text-xs font-semibold px-3 py-1 rounded-full ${
                darkMode
                  ? 'text-violet-300 bg-violet-900/30'
                  : 'text-violet-700 bg-violet-100'
              }`}>
                {req.priority?.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {project.timeline && project.timeline.length > 0 && (
        <div>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-slate-50' : 'text-slate-900'}`}>
            Project Timeline
          </h2>
          <div className="space-y-3">
            {project.timeline.map((event, i) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    event.completed
                      ? 'bg-green-600 border-green-600'
                      : darkMode
                        ? 'border-slate-600'
                        : 'border-slate-300'
                  }`}>
                    {event.completed && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  {i < project.timeline.length - 1 && (
                    <div className={`w-0.5 h-12 mt-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
                  )}
                </div>
                <div className="pb-6">
                  <div className={`font-semibold ${
                    event.completed
                      ? darkMode
                        ? 'text-slate-100'
                        : 'text-slate-900'
                      : darkMode
                        ? 'text-slate-400'
                        : 'text-slate-600'
                  }`}>
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
