import { CheckCircle2, Package, AlertCircle } from 'lucide-react';
import { AddOn } from '@/lib/types';

interface AddOnManagerProps {
  addons: AddOn[];
}

export function AddOnManager({ addons }: AddOnManagerProps) {
  const approvedAddOns = addons.filter(a => a.status === 'added');
  const availableAddOns = addons.filter(a => a.status === 'available');

  return (
    <div className="space-y-6">
      {approvedAddOns.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-slate-900">Approved Add-ons</h3>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-auto">
              {approvedAddOns.length}
            </span>
          </div>

          <div className="grid gap-3">
            {approvedAddOns.map(addon => (
              <div
                key={addon.id}
                className="p-4 border-l-4 border-l-green-600 bg-green-50 rounded-lg"
              >
                <div className="font-semibold text-green-900">{addon.name}</div>
                <p className="text-sm text-green-800 mt-1">{addon.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {availableAddOns.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-slate-600" />
            <h3 className="font-bold text-slate-900">Available Add-ons</h3>
            <span className="text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded ml-auto">
              {availableAddOns.length}
            </span>
          </div>

          <div className="grid gap-3">
            {availableAddOns.map(addon => (
              <div
                key={addon.id}
                className="p-4 border border-slate-300 rounded-lg hover:border-violet-300 hover:bg-violet-50 transition"
              >
                <div className="font-semibold text-slate-900">{addon.name}</div>
                <p className="text-sm text-slate-600 mt-1">{addon.description}</p>
                <button className="text-xs text-violet-600 hover:text-violet-700 font-medium mt-3">
                  + Add to project
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <strong>Note:</strong> Adding new features may impact timeline and budget. Discuss with your client before making changes.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
