'use client';

import { TrendingUp, TrendingDown, Minus, Lightbulb, ArrowRight } from 'lucide-react';
import { ProductInsight } from '@/lib/types';

interface InsightsCardProps {
  insight: ProductInsight;
  onCreateRequirement?: (insight: ProductInsight) => void;
}

const trendIcon = {
  increasing: TrendingUp,
  decreasing: TrendingDown,
  stable: Minus,
};

const trendColor = {
  increasing: 'text-red-600 bg-red-50',
  decreasing: 'text-green-600 bg-green-50',
  stable: 'text-slate-500 bg-slate-50',
};

export function InsightsCard({ insight, onCreateRequirement }: InsightsCardProps) {
  const TrendIcon = trendIcon[insight.trend];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-violet-50 flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{insight.title}</h3>
          </div>
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded flex-shrink-0 ${trendColor[insight.trend]}`}>
          <TrendIcon className="w-3.5 h-3.5" />
          {insight.trend}
        </span>
      </div>

      <div className="space-y-3 ml-11">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Evidence</div>
          <p className="text-sm text-slate-700">{insight.evidence}</p>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Impact</div>
          <p className="text-sm text-slate-700">{insight.impact}</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
          <div className="text-xs font-semibold text-indigo-600 uppercase mb-1">Suggested Action</div>
          <p className="text-sm text-indigo-900">{insight.suggestedAction}</p>
        </div>

        {onCreateRequirement && (
          <button
            onClick={() => onCreateRequirement(insight)}
            className="flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-800 transition"
          >
            Create Requirement
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
