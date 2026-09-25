import { Sparkles, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Feedback, FeedbackCluster, ProductInsight } from '@/lib/types';

// Snapshot the "current time" once at module load (not during render) so the
// component stays pure per React's rules-of-hooks purity check.
const NOW = Date.now();

interface ExecutiveSummaryProps {
  feedbacks: Feedback[];
  clusters: FeedbackCluster[];
  insights: ProductInsight[];
  healthScore: number;
}

// Builds a data-driven natural-language summary — every number here is computed
// from the actual feedback/cluster/insight arrays passed in, nothing hardcoded.
export function ExecutiveSummary({ feedbacks, clusters, insights, healthScore }: ExecutiveSummaryProps) {
  const total = feedbacks.length;
  const negative = feedbacks.filter(f => f.sentiment === 'negative').length;
  const positive = feedbacks.filter(f => f.sentiment === 'positive').length;
  const negativePercent = Math.round((negative / total) * 100);
  const positivePercent = Math.round((positive / total) * 100);

  const criticalClusters = clusters.filter(c => c.impactLevel === 'critical' || c.impactLevel === 'high');
  const risingClusters = clusters.filter(c => c.trend === 'increasing');
  const improvingClusters = clusters.filter(c => c.trend === 'decreasing');

  // Exclude praise/uncategorized buckets - the summary should surface the biggest
  // *actionable* theme, not the fact that many people simply said nice things.
  const topCluster = [...clusters]
    .filter(c => c.title !== 'General Praise & Satisfaction' && c.title !== 'Other Feedback')
    .sort((a, b) => b.feedbackIds.length - a.feedbackIds.length)[0];

  const bugCount = feedbacks.filter(f => f.aiClassification === 'bug').length;
  const featureCount = feedbacks.filter(f => f.aiClassification === 'feature').length;

  const recentFeedback = feedbacks.filter(f => NOW - f.date < 604800000).length;

  const healthNarrative =
    healthScore >= 80
      ? 'in strong shape'
      : healthScore >= 60
        ? 'stable, with a few areas that need attention'
        : healthScore >= 40
          ? 'showing signs of strain'
          : 'facing significant user dissatisfaction';

  return (
    <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5" />
        <h2 className="font-bold text-lg">Executive Summary</h2>
      </div>

      <p className="text-violet-50 leading-relaxed mb-4">
        Based on <strong>{total} feedback entries</strong> across {new Set(feedbacks.map(f => f.source)).size} channels, your
        product is <strong>{healthNarrative}</strong> (health score {healthScore}/100). Sentiment is split{' '}
        {positivePercent}% positive / {negativePercent}% negative, with {recentFeedback} new reports in the last 7 days.
        {topCluster && (
          <>
            {' '}
            The largest cluster of feedback is <strong>&ldquo;{topCluster.title}&rdquo;</strong> ({topCluster.feedbackIds.length} reports,{' '}
            {topCluster.trend}), accounting for {Math.round((topCluster.feedbackIds.length / total) * 100)}% of all signals.
          </>
        )}
        {' '}Across all feedback, {bugCount} reports classify as bugs and {featureCount} as feature requests.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-200 text-xs font-semibold uppercase mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Needs Attention
          </div>
          <div className="text-2xl font-bold">{criticalClusters.length}</div>
          <div className="text-xs text-violet-100">high/critical impact clusters</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 text-orange-200 text-xs font-semibold uppercase mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Rising Trends
          </div>
          <div className="text-2xl font-bold">{risingClusters.length}</div>
          <div className="text-xs text-violet-100">clusters growing week over week</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-200 text-xs font-semibold uppercase mb-1">
            <TrendingDown className="w-3.5 h-3.5" />
            Improving
          </div>
          <div className="text-2xl font-bold">{improvingClusters.length}</div>
          <div className="text-xs text-violet-100">clusters trending down</div>
        </div>
      </div>

      {insights.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="text-xs font-semibold uppercase text-violet-100 mb-1">Top recommendation</div>
          <p className="text-sm text-white">{insights[0].suggestedAction}</p>
        </div>
      )}
    </div>
  );
}
