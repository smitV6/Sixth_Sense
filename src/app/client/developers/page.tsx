'use client';

import { useState } from 'react';
import { MOCK_DEVELOPERS } from '@/lib/mock-developers';
import { useProjectStore } from '@/lib/project-store';
import { useToastStore } from '@/lib/toast-store';
import { useRouter } from 'next/navigation';
import { Code } from 'lucide-react';

export default function DevelopersPage() {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [confirmModal, setConfirmModal] = useState<{ developer: string; open: boolean }>({ developer: '', open: false });
  const sendProject = useProjectStore(state => state.sendProjectToDeveloper);
  const { projects } = useProjectStore();
  const { addToast } = useToastStore();
  const router = useRouter();

  const handleSendProject = (developerId: string) => {
    if (!selectedProject) {
      addToast('Please select a project first', 'error');
      return;
    }
    setConfirmModal({ developer: developerId, open: true });
  };

  const handleConfirmSend = () => {
    if (!selectedProject || !confirmModal.developer) return;

    sendProject(selectedProject, confirmModal.developer);
    setConfirmModal({ developer: '', open: false });
    addToast('Project sent successfully! ✓', 'success');

    setTimeout(() => {
      router.push(`/developer/requests`);
    }, 1500);
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Find a Developer</h1>
        <p className="text-slate-600 mt-2">Choose a developer to send your project</p>
      </div>

      {projects.length > 0 && (
        <div className="bg-indigo-50 p-6 rounded-xl border-2 border-indigo-200">
          <label className="block text-sm font-semibold text-slate-900 mb-3">Select a project to send:</label>
          <select
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}
            className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-600 bg-white"
          >
            <option value="">Choose a project...</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name} ({project.coreRequirements.length + project.addedRequirements.length} requirements)
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {MOCK_DEVELOPERS.map(dev => (
          <div key={dev.id} className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-indigo-300 hover:shadow-lg transition flex flex-col">
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
              >
                {dev.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900">{dev.name}</h3>
                <p className="text-sm text-slate-600">{dev.title}</p>
              </div>
            </div>

            <div className="mb-6 flex-1">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Code className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-semibold text-slate-900">Skills</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dev.skills.map(skill => (
                    <div key={skill} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-slate-200">
                <div>
                  <div className="text-xs text-slate-600">Completed Projects</div>
                  <div className="text-2xl font-bold text-slate-900">{dev.projects}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-600">Status</div>
                  <div className={`text-lg font-bold ${
                    dev.availability === 'available' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {dev.availability === 'available' ? 'Available' : dev.busyUntil}
                  </div>
                </div>
              </div>
            </div>

            {dev.availability === 'available' ? (
              <button
                onClick={() => handleSendProject(dev.id)}
                disabled={!selectedProject}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  selectedProject
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Select Developer
              </button>
            ) : (
              <button className="w-full py-3 bg-slate-200 text-slate-600 rounded-lg font-semibold cursor-not-allowed">
                View Profile
              </button>
            )}
          </div>
        ))}
      </div>

      {confirmModal.open && selectedProjectData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send {selectedProjectData.name} to {MOCK_DEVELOPERS.find(d => d.id === confirmModal.developer)?.name}?</h2>

            <div className="bg-slate-50 p-4 rounded-lg mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-700">Project requirements:</span>
                <span className="font-semibold text-slate-900">{selectedProjectData.coreRequirements.length + selectedProjectData.addedRequirements.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Optional add-ons:</span>
                <span className="font-semibold text-slate-900">{selectedProjectData.optionalAddOns.filter(a => a.status === 'added').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Estimated scope:</span>
                <span className="font-semibold text-slate-900">Medium</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setConfirmModal({ developer: '', open: false })}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-900 rounded-lg hover:border-slate-400 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSend}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
              >
                Send Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
