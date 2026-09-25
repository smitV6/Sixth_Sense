'use client';

import { useMemo } from 'react';
import { MOCK_FEEDBACK } from '@/lib/mock-feedback-data';
import { clusterFeedback } from '@/lib/feedback-service';
import { TrendingUp, TrendingDown, Minus, Users } from 'lucide-react';

const trendIcon = { increasing: TrendingUp, decreasing: TrendingDown, stable: Minus };
const trendColor = { increasing: 'text-red-600', decreasing: 'text-green-600', stable: 'text-slate-500' };

export default function FeatureRequestsPage() {
  const featureFeedback = useMemo(() => MOCK_FEEDBACK.filter(f => f.aiClassification === 'feature'), []);
  const clusters = useMemo(() => clusterFeedback(featureFeedback).sort((a, b) => b.feedbackIds.length - a.feedbackIds.length), [
    featureFeedback,
  ]);

  const totalVotes = featureFeedback.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Feature Request Intelligence</h1>
        <p className="text-slate-600 mt-1">
          {totalVotes} feature requests grouped into {clusters.length} themes by similarity, ranked by demand.
        </p>
      </div>

      <div className="space-y-3">
        {clusters.map((cluster, idx) => {
          const TrendIcon = trendIcon[cluster.trend];
          const demandPercent = Math.round((cluster.feedbackIds.length / totalVotes) * 100);

          return (
            <div key={cluster.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{cluster.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{cluster.aiSummary}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Users className="w-4 h-4" />
                        {cluster.feedbackIds.length} requests ({demandPercent}% of all requests)
                      </span>
                      <span className={`flex items-center gap-1 ${trendColor[cluster.trend]}`}>
                        <TrendIcon className="w-4 h-4" />
                        {cluster.trend}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="w-24 bg-slate-100 rounded-full h-2">
                    <div className="bg-violet-600 h-2 rounded-full" style={{ width: `${demandPercent}%` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
