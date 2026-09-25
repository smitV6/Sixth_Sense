import { CheckCircle2 } from 'lucide-react';
import { Requirement } from '@/lib/types';

export function CoreRequirements({ requirements }: { requirements: Requirement[] }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Core Requirements</h2>
      <div className="grid gap-3">
        {requirements.map(req => (
          <div key={req.id} className="flex items-start gap-4 p-4 bg-white border-2 border-slate-200 rounded-xl">
            <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-semibold text-slate-900">{req.name}</div>
              <p className="text-sm text-slate-600 mt-1">{req.description}</p>
            </div>
            <div className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">✓ Core</div>
          </div>
        ))}
      </div>
    </div>
  );
}
