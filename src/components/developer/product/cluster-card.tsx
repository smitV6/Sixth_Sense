import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus, MessageSquareText } from 'lucide-react';
import { FeedbackCluster } from '@/lib/types';
import { SentimentChart } from './sentiment-chart';

interface ClusterCardProps {
  cluster: FeedbackCluster;
  productId: string;
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

const trendColor = {
  increasing: 'text-red-600',
  decreasing: 'text-green-600',
  stable: 'text-slate-500',
};

export function ClusterCard({ cluster }: ClusterCardProps) {
  const TrendIcon = trendIcon[cluster.trend];
  const count = cluster.feedbackIds.length;

  return (
    <Link
      href={`/developer/my-product/clusters/${cluster.id}`}
      className="block bg-white p-6 rounded-xl border border-slate-200 hover:border-violet-300 hover:shadow-lg transition"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 text-lg">{cluster.title}</h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <MessageSquareText className="w-3.5 h-3.5" />
              {count} report{count !== 1 ? 's' : ''}
            </span>
            <span className={`flex items-center gap-1 ${trendColor[cluster.trend]}`}>
              <TrendIcon className="w-3.5 h-3.5" />
              {cluster.trend}
            </span>
          </div>
        </div>
        <span className={`text-xs font-bold uppercase px-2 py-1 rounded border flex-shrink-0 ${impactColors[cluster.impactLevel]}`}>
          {cluster.impactLevel}
        </span>
      </div>

      <p className="text-slate-600 text-sm mb-4 line-clamp-2">{cluster.aiSummary}</p>

      <SentimentChart distribution={cluster.sentimentDistribution} compact />
    </Link>
  );
}
