'use client';

import { useProjectStore } from '@/lib/project-store';
import { ClusterCard } from '@/components/developer/product/cluster-card';

export default function ClustersPage() {
  const product = useProjectStore(state => state.products[0]);

  if (!product) {
    return <div className="text-slate-500">No product data available.</div>;
  }

  const sortedClusters = [...product.clusters].sort((a, b) => b.feedbackIds.length - a.feedbackIds.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Feedback Clusters</h1>
        <p className="text-slate-600 mt-1">
          AI groups similar feedback into {product.clusters.length} clusters, ranked by report volume and impact.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedClusters.map(cluster => (
          <ClusterCard key={cluster.id} cluster={cluster} productId={product.id} />
        ))}
      </div>
    </div>
  );
}
