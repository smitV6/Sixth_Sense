'use client';

import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import { FeedbackCluster, Feedback } from '@/lib/types';
import { SentimentChart } from './sentiment-chart';
import { FeedbackList } from './feedback-list';

interface ClusterDetailProps {
  cluster: FeedbackCluster;
  allFeedback: Feedback[];
}

const impactColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-800 border-red-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  low: 'bg-blue-100 text-blue-800 border-blue-300',
};

const trendIcon = {
  increasing: TrendingUp,
  decreasing: TrendingDown,
  stable: Minus,
};

export function ClusterDetail({ cluster, allFeedback }: ClusterDetailProps) {
  const clusterFeedback = allFeedback.filter(f => cluster.feedbackIds.includes(f.id));
  const TrendIcon = trendIcon[cluster.trend];

  const sourceBreakdown = clusterFeedback.reduce<Record<string, number>>((acc, f) => {
    acc[f.source] = (acc[f.source] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{cluster.title}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
              <span>{clusterFeedback.length} feedback entries</span>
              <span className="flex items-center gap-1">
                <TrendIcon className="w-4 h-4" />
                {cluster.trend}
              </span>
            </div>
          </div>
          <span className={`text-sm font-bold uppercase px-3 py-1.5 rounded border ${impactColors[cluster.impactLevel]}`}>
            {cluster.impactLevel} impact
          </span>
        </div>

        <div className="bg-violet-50 border border-violet-100 rounded-lg p-4 flex gap-3">
          <Sparkles className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-violet-600 uppercase mb-1">AI Summary</div>
            <p className="text-sm text-violet-900">{cluster.aiSummary}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Sentiment Distribution</div>
            <SentimentChart distribution={cluster.sentimentDistribution} />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Sources</div>
            <div className="space-y-1">
              {Object.entries(sourceBreakdown).map(([source, count]) => (
                <div key={source} className="flex justify-between text-sm text-slate-700">
                  <span className="capitalize">{source.replace('_', ' ')}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">All Feedback in this Cluster</h2>
        <FeedbackList feedbacks={clusterFeedback} />
      </div>
    </div>
  );
}
