import { Sparkles } from 'lucide-react';

export function AnalysisSummary({ summary }: { summary: string }) {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-violet-50 p-8 rounded-2xl border-2 border-indigo-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-indigo-600" />
        Here's what Sixth Sense found
      </h2>
      <p className="text-lg text-slate-700">{summary}</p>
    </div>
  );
}
