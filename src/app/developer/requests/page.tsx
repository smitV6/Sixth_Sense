'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useProjectStore } from '@/lib/project-store';
import { ArrowRight, Clock, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

const CURRENT_DEVELOPER_ID = '1'; // Alex Sharma

export default function ClientRequestsPage() {
  const getDeveloperRequests = useProjectStore(state => state.getDeveloperRequests);
  const requests = getDeveloperRequests(CURRENT_DEVELOPER_ID);
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'accept' | 'reject' | 'clarify' | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleAction = (projectId: string, action: 'accept' | 'reject' | 'clarify') => {
    setSelectedProjectId(projectId);
    setSelectedAction(action);
    setShowModal(true);
  };

  const confirmAction = () => {
    if (selectedAction === 'accept') {
      console.log('Accepting project:', selectedProjectId);
      // TODO: Update project status in store
    } else if (selectedAction === 'reject') {
      console.log('Rejecting project:', selectedProjectId);
      // TODO: Update project status in store
    } else if (selectedAction === 'clarify') {
      console.log('Requesting clarification for project:', selectedProjectId);
      // TODO: Update project status in store
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Client Requests</h2>
        <p className="text-slate-600 mt-1">Projects sent to you by clients</p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
          <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 mb-4">No client requests yet</p>
          <p className="text-sm text-slate-500">Client projects you receive will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(({ project, sentAt }) => (
            <div
              key={project.id}
              className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-violet-300 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <Link
                  href={`/developer/projects/${project.id}`}
                  className="flex-1 group hover:no-underline"
                >
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-violet-600 transition">
                    {project.name}
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">{project.description}</p>
                  {project.targetUsers && <p className="text-slate-600 text-sm mt-2">Target Users: {project.targetUsers}</p>}
                </Link>
                <div className="text-sm font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                  Pending Review
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4 py-4 border-t border-b border-slate-200">
                <div>
                  <div className="text-xs text-slate-600">Core Requirements</div>
                  <div className="text-lg font-bold text-slate-900">{project.coreRequirements.length}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-600">Added Requirements</div>
                  <div className="text-lg font-bold text-slate-900">{project.addedRequirements.length}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-600">Optional Add-ons</div>
                  <div className="text-lg font-bold text-slate-900">
                    {project.optionalAddOns.filter(a => a.status === 'added').length}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">Sent {new Date(sentAt).toLocaleDateString()}</div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(project.id, 'accept')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(project.id, 'clarify')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Clarify
                  </button>
                  <button
                    onClick={() => handleAction(project.id, 'reject')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 text-sm font-medium"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>

              <Link
                href={`/developer/projects/${project.id}`}
                className="text-violet-600 hover:text-violet-700 text-sm font-medium mt-4 flex items-center gap-2 w-fit"
              >
                View Full Project
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                {selectedAction === 'accept'
                  ? 'Accept Project?'
                  : selectedAction === 'reject'
                    ? 'Reject Project?'
                    : 'Request Clarification?'}
              </h3>
              <p className="text-slate-600 mt-2">
                {selectedAction === 'accept'
                  ? 'This project will be added to your active projects. You can start development immediately.'
                  : selectedAction === 'reject'
                    ? 'The client will be notified that you cannot take on this project.'
                    : 'You can ask the client for more details or clarifications about the project requirements.'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-900 rounded-lg hover:bg-slate-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-3 text-white rounded-lg transition font-medium ${
                  selectedAction === 'accept'
                    ? 'bg-green-600 hover:bg-green-700'
                    : selectedAction === 'reject'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {selectedAction === 'accept' ? 'Accept' : selectedAction === 'reject' ? 'Reject' : 'Request Clarification'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
