'use client';

import { useState } from 'react';
import { useProjectStore } from '@/lib/project-store';
import { InsightsCard } from '@/components/developer/product/insights-card';
import { CreateRequirementModal } from '@/components/developer/product/create-requirement-modal';
import { ProductInsight, Requirement, PriorityLevel } from '@/lib/types';
import { useToastStore } from '@/lib/toast-store';

export default function InsightsPage() {
  const product = useProjectStore(state => state.products[0]);
  const addRequirementToProduct = useProjectStore(state => state.addRequirementToProduct);
  const [selectedInsight, setSelectedInsight] = useState<ProductInsight | null>(null);
  const addToast = useToastStore(state => state.addToast);

  if (!product) {
    return <div className="text-slate-500">No product data available.</div>;
  }

  const handleCreateRequirement = (data: {
    name: string;
    description: string;
    priority: PriorityLevel;
    estimatedEffort: 'small' | 'medium' | 'large';
  }) => {
    const requirement: Requirement = {
      id: `req-${Date.now()}`,
      name: data.name,
      description: data.description,
      status: 'pending',
      priority: data.priority,
      estimatedEffort: data.estimatedEffort,
    };
    addRequirementToProduct(product.id, requirement);
    addToast(`Requirement "${data.name}" created`, 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Insights</h1>
        <p className="text-slate-600 mt-1">
          Patterns and recommendations synthesized from {product.clusters.reduce((sum, c) => sum + c.feedbackIds.length, 0)}{' '}
          feedback entries across {product.clusters.length} clusters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {product.insights.map(insight => (
          <InsightsCard key={insight.id} insight={insight} onCreateRequirement={setSelectedInsight} />
        ))}
      </div>

      <CreateRequirementModal
        insight={selectedInsight}
        onClose={() => setSelectedInsight(null)}
        onCreate={handleCreateRequirement}
      />
    </div>
  );
}
