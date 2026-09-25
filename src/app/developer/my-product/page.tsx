'use client';

import Link from 'next/link';
import { useProjectStore } from '@/lib/project-store';
import { MOCK_FEEDBACK } from '@/lib/mock-feedback-data';
import { ExecutiveSummary } from '@/components/developer/product/executive-summary';
import { ProductHealthCard } from '@/components/developer/product/product-health-card';
import { ProductMetrics } from '@/components/developer/product/product-metrics';
import { ClusterCard } from '@/components/developer/product/cluster-card';
import { calculateProductHealth } from '@/lib/feedback-service';
import { ArrowRight } from 'lucide-react';

export default function MyProductPage() {
  const product = useProjectStore(state => state.products[0]);

  if (!product) {
    return <div className="text-slate-500">No product data available.</div>;
  }

  const health = calculateProductHealth(MOCK_FEEDBACK);
  const topClusters = [...product.clusters]
    .sort((a, b) => b.feedbackIds.length - a.feedbackIds.length)
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
          <p className="text-slate-600 mt-1">{product.description}</p>
          <p className="text-xs text-slate-400 mt-1">
            {product.category} &middot; v{product.version}
          </p>
        </div>
      </div>

      <ExecutiveSummary
        feedbacks={MOCK_FEEDBACK}
        clusters={product.clusters}
        insights={product.insights}
        healthScore={health.score}
      />

      <ProductMetrics product={product} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProductHealthCard score={health.score} reasons={health.reasons} />
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Top Feedback Clusters</h2>
            <Link href="/developer/my-product/clusters" className="text-sm font-semibold text-violet-600 hover:text-violet-800 flex items-center gap-1">
              View all clusters <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topClusters.map(cluster => (
              <ClusterCard key={cluster.id} cluster={cluster} productId={product.id} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/developer/my-product/feedback"
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-violet-300 hover:shadow-lg transition text-center"
        >
          <div className="text-2xl font-bold text-slate-900">{MOCK_FEEDBACK.length}</div>
          <div className="text-sm text-slate-600 mt-1">Feedback Entries</div>
        </Link>
        <Link
          href="/developer/my-product/clusters"
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-violet-300 hover:shadow-lg transition text-center"
        >
          <div className="text-2xl font-bold text-slate-900">{product.clusters.length}</div>
          <div className="text-sm text-slate-600 mt-1">AI Clusters</div>
        </Link>
        <Link
          href="/developer/my-product/insights"
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-violet-300 hover:shadow-lg transition text-center"
        >
          <div className="text-2xl font-bold text-slate-900">{product.insights.length}</div>
          <div className="text-sm text-slate-600 mt-1">AI Insights</div>
        </Link>
        <Link
          href="/developer/my-product/feature-requests"
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-violet-300 hover:shadow-lg transition text-center"
        >
          <div className="text-2xl font-bold text-slate-900">
            {MOCK_FEEDBACK.filter(f => f.aiClassification === 'feature').length}
          </div>
          <div className="text-sm text-slate-600 mt-1">Feature Requests</div>
        </Link>
      </div>
    </div>
  );
}
