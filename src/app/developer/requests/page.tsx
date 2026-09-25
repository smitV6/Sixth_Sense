'use client';

import Link from 'next/link';
import { useProjectStore } from '@/lib/project-store';
import { ArrowRight, Clock } from 'lucide-react';

const CURRENT_DEVELOPER_ID = '1'; // Alex Sharma

export default function ClientRequestsPage() {
  const getDeveloperRequests = useProjectStore(state => state.getDeveloperRequests);
  const requests = getDeveloperRequests(CURRENT_DEVELOPER_ID);

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
            <Link
              key={project.id}
              href={`/developer/projects/${project.id}`}
              className="block bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-violet-300 hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-violet-600 transition">{project.name}</h3>
                  <p className="text-slate-600 text-sm mt-1">{project.description}</p>
                  {project.targetUsers && <p className="text-slate-600 text-sm mt-2">Target Users: {project.targetUsers}</p>}
                </div>
                <div className="text-sm font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                  Client Review
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
                  <div className="text-lg font-bold text-slate-900">{project.optionalAddOns.filter(a => a.status === 'added').length}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Sent {new Date(sentAt).toLocaleDateString()}
                </div>
                <ArrowRight className="w-5 h-5 text-violet-600 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
