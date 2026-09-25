'use client';

import { Lightbulb, Plus, X } from 'lucide-react';
import { Suggestion } from '@/lib/types';
import { useToastStore } from '@/lib/toast-store';

interface MissingRequirementsProps {
  suggestions: Suggestion[];
  onAdd: (id: string) => void;
  onDismiss: (id: string) => void;
  addedSuggestions: Set<string>;
  dismissedSuggestions: Set<string>;
}

const priorityColors = {
  critical: 'bg-red-200 text-red-900 border-red-400',
  high: 'bg-red-100 text-red-800 border-red-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  low: 'bg-blue-100 text-blue-800 border-blue-300',
};

export function MissingRequirements({
  suggestions,
  onAdd,
  onDismiss,
  addedSuggestions,
  dismissedSuggestions,
}: MissingRequirementsProps) {
  const { addToast } = useToastStore();

  const handleAdd = (id: string) => {
    onAdd(id);
    addToast('Requirement added ✓', 'success');
  };

  const addedCount = suggestions.filter(s => addedSuggestions.has(s.id)).length;

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-8 rounded-2xl border-2 border-amber-300">
      <h2 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
        <Lightbulb className="w-6 h-6 text-amber-600" />
        Sixth Sense noticed...
      </h2>
      <p className="text-slate-700 mb-6">
        These requirements weren&apos;t explicitly mentioned, but may be important for your product.
      </p>

      <div className="space-y-4">
        {suggestions.map(suggestion => {
          const isAdded = addedSuggestions.has(suggestion.id);
          const isDismissed = dismissedSuggestions.has(suggestion.id);

          if (isDismissed) {
            return null;
          }

          return (
            <div key={suggestion.id} className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-amber-300 transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 text-lg mb-2">{suggestion.title}</div>
                  <p className="text-slate-600 mb-3">{suggestion.description}</p>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${priorityColors[suggestion.priority]}`}>
                    {suggestion.priority.toUpperCase()}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!isAdded ? (
                    <>
                      <button
                        onClick={() => handleAdd(suggestion.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                      <button
                        onClick={() => onDismiss(suggestion.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-semibold text-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold text-sm">✓ Added</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {addedCount > 0 && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg font-medium text-sm">
          {addedCount} requirement{addedCount !== 1 ? 's' : ''} added
        </div>
      )}
    </div>
  );
}
