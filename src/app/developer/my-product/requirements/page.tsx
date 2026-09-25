'use client';

import Link from 'next/link';
import { useProjectStore } from '@/lib/project-store';
import { FileText, ArrowRight } from 'lucide-react';

const priorityColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-800 border-red-300',
  high: 'bg-red-100 text-red-800 border-red-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  low: 'bg-blue-100 text-blue-800 border-blue-300',
};

export default function RequirementsPage() {
  const product = useProjectStore(state => state.products[0]);

  if (!product) {
    return <div className="text-slate-500">No product data available.</div>;
  }

  const requirements = product.requirements || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Requirements from Insights</h1>
        <p className="text-slate-600 mt-1">
          Requirements created from AI insights, bridging feedback intelligence into actionable development work.
        </p>
      </div>

      {requirements.length === 0 ? (
        <div className="p-8 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-center">
          <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-700 font-medium">No requirements created yet</p>
          <p className="text-slate-500 text-sm mt-1 mb-4">
            Go to AI Insights and click &ldquo;Create Requirement&rdquo; on any insight to add it here.
          </p>
          <Link
            href="/developer/my-product/insights"
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition font-semibold text-sm"
          >
            View AI Insights <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {requirements.map(req => (
            <div key={req.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{req.name}</h3>
                  <p className="text-slate-600 text-sm mt-1">{req.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    {req.priority && (
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${priorityColors[req.priority]}`}>
                        {req.priority}
                      </span>
                    )}
                    {req.estimatedEffort && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-700 capitalize">
                        {req.estimatedEffort} effort
                      </span>
                    )}
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 capitalize">
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
