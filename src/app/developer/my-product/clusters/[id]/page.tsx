'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useProjectStore } from '@/lib/project-store';
import { MOCK_FEEDBACK } from '@/lib/mock-feedback-data';
import { ClusterDetail } from '@/components/developer/product/cluster-detail';

export default function ClusterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = useProjectStore(state => state.products[0]);

  const cluster = product?.clusters.find(c => c.id === id);

  if (!cluster) {
    return (
      <div className="space-y-4">
        <Link href="/developer/my-product/clusters" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800">
          <ArrowLeft className="w-4 h-4" /> Back to clusters
        </Link>
        <div className="text-slate-500">Cluster not found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link href="/developer/my-product/clusters" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="w-4 h-4" /> Back to clusters
      </Link>
      <ClusterDetail cluster={cluster} allFeedback={MOCK_FEEDBACK} />
    </div>
  );
}
