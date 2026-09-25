import { TrendingUp } from 'lucide-react';

interface ProjectBlueprintProps {
  coreCount: number;
  addedCount: number;
  addOnsCount: number;
  health: {
    clarity: number;
    note: string;
  };
}

export function ProjectBlueprint({ coreCount, addedCount, addOnsCount, health }: ProjectBlueprintProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-indigo-600" />
        Your Project Blueprint
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border-2 border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Requirements</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Core Requirements</span>
              <span className="text-2xl font-bold text-indigo-600">{coreCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Added Requirements</span>
              <span className="text-2xl font-bold text-violet-600">{addedCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Optional Add-ons</span>
              <span className="text-2xl font-bold text-slate-900">{addOnsCount}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 p-6 rounded-xl border-2 border-indigo-200">
          <h3 className="font-semibold text-slate-900 mb-4">Project Health</h3>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-700 font-medium">Requirements clarity</span>
              <span className="text-2xl font-bold text-indigo-600">{health.clarity}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-600 to-violet-600 h-2 rounded-full"
                style={{ width: `${health.clarity}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-slate-700">{health.note}</p>
        </div>
      </div>
    </div>
  );
}
