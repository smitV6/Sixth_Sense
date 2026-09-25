import { SentimentDistribution } from '@/lib/types';

interface SentimentChartProps {
  distribution: SentimentDistribution;
  compact?: boolean;
}

export function SentimentChart({ distribution, compact = false }: SentimentChartProps) {
  const total = distribution.positive + distribution.neutral + distribution.negative;
  if (total === 0) {
    return <div className="text-sm text-slate-500">No sentiment data</div>;
  }

  const positivePercent = Math.round((distribution.positive / total) * 100);
  const neutralPercent = Math.round((distribution.neutral / total) * 100);
  const negativePercent = 100 - positivePercent - neutralPercent;

  if (compact) {
    return (
      <div className="space-y-1">
        <div className="flex w-full h-2 rounded-full overflow-hidden bg-slate-100">
          <div className="bg-green-500" style={{ width: `${positivePercent}%` }} />
          <div className="bg-slate-300" style={{ width: `${neutralPercent}%` }} />
          <div className="bg-red-500" style={{ width: `${negativePercent}%` }} />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>{positivePercent}% positive</span>
          <span>{negativePercent}% negative</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex w-full h-4 rounded-full overflow-hidden bg-slate-100">
        <div className="bg-green-500" style={{ width: `${positivePercent}%` }} title={`Positive: ${positivePercent}%`} />
        <div className="bg-slate-300" style={{ width: `${neutralPercent}%` }} title={`Neutral: ${neutralPercent}%`} />
        <div className="bg-red-500" style={{ width: `${negativePercent}%` }} title={`Negative: ${negativePercent}%`} />
      </div>
      <div className="flex justify-between mt-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
          <span className="text-slate-700">Positive {positivePercent}% ({distribution.positive})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
          <span className="text-slate-700">Neutral {neutralPercent}% ({distribution.neutral})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
          <span className="text-slate-700">Negative {negativePercent}% ({distribution.negative})</span>
        </div>
      </div>
    </div>
  );
}
