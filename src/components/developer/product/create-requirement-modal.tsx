'use client';

import { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { ProductInsight, PriorityLevel } from '@/lib/types';

interface CreateRequirementModalProps {
  insight: ProductInsight | null;
  onClose: () => void;
  onCreate: (data: { name: string; description: string; priority: PriorityLevel; estimatedEffort: 'small' | 'medium' | 'large' }) => void;
}

export function CreateRequirementModal({ insight, onClose, onCreate }: CreateRequirementModalProps) {
  const [name, setName] = useState(insight?.title || '');
  const [description, setDescription] = useState(insight ? `${insight.evidence} ${insight.suggestedAction}` : '');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [effort, setEffort] = useState<'small' | 'medium' | 'large'>('medium');
  const [created, setCreated] = useState(false);

  if (!insight) return null;

  const handleSubmit = () => {
    onCreate({ name, description, priority, estimatedEffort: effort });
    setCreated(true);
    setTimeout(() => {
      setCreated(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
        {created ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="font-semibold text-slate-900">Requirement created</p>
            <p className="text-sm text-slate-500 mt-1">Added to your product requirements list</p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Create Requirement from Insight</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as PriorityLevel)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Estimated Effort</label>
                  <select
                    value={effort}
                    onChange={e => setEffort(e.target.value as 'small' | 'medium' | 'large')}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!name.trim()}
                className="flex-1 px-4 py-2 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 transition disabled:opacity-50"
              >
                Create Requirement
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
