'use client';

import { Plus } from 'lucide-react';
import { AddOn } from '@/lib/types';

interface OptionalAddOnsProps {
  addOns: AddOn[];
  onAdd: (id: string) => void;
  addedAddOns: Set<string>;
}

export function OptionalAddOns({ addOns, onAdd, addedAddOns }: OptionalAddOnsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">Want to take it further?</h2>
      <p className="text-slate-600 mb-6">These features aren't required for the core product, but could improve the experience.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {addOns.map(addOn => (
          <div key={addOn.id} className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-violet-300 transition flex flex-col">
            <h3 className="font-semibold text-slate-900 mb-2">{addOn.name}</h3>
            <p className="text-sm text-slate-600 mb-4 flex-1">{addOn.description}</p>
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-violet-700 bg-violet-100 px-3 py-1 rounded-full">Potential Add-on</div>
              <button
                onClick={() => onAdd(addOn.id)}
                disabled={addedAddOns.has(addOn.id)}
                className={`p-2 rounded-lg transition ${
                  addedAddOns.has(addOn.id)
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 hover:bg-violet-100 text-slate-700 hover:text-violet-700'
                }`}
              >
                {addedAddOns.has(addOn.id) ? '✓' : <Plus className="w-5 h-5" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
