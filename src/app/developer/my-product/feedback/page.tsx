'use client';

import { useState, useMemo } from 'react';
import { MOCK_FEEDBACK } from '@/lib/mock-feedback-data';
import { FeedbackSearch, FeedbackFilters } from '@/components/developer/product/feedback-search';
import { FeedbackList } from '@/components/developer/product/feedback-list';

const DEFAULT_FILTERS: FeedbackFilters = {
  query: '',
  sentiment: 'all',
  source: 'all',
  classification: 'all',
  status: 'all',
};

export default function FeedbackPage() {
  const [filters, setFilters] = useState<FeedbackFilters>(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    return MOCK_FEEDBACK.filter(fb => {
      if (filters.sentiment !== 'all' && fb.sentiment !== filters.sentiment) return false;
      if (filters.source !== 'all' && fb.source !== filters.source) return false;
      if (filters.classification !== 'all' && fb.aiClassification !== filters.classification) return false;
      if (filters.status !== 'all' && fb.status !== filters.status) return false;
      if (filters.query.trim()) {
        const q = filters.query.toLowerCase();
        if (!fb.text.toLowerCase().includes(q) && !fb.userName.toLowerCase().includes(q)) return false;
      }
      return true;
    }).sort((a, b) => b.date - a.date);
  }, [filters]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Feedback Center</h1>
        <p className="text-slate-600 mt-1">Search and review all feedback collected across channels.</p>
      </div>

      <FeedbackSearch filters={filters} onChange={setFilters} resultCount={filtered.length} totalCount={MOCK_FEEDBACK.length} />

      <FeedbackList feedbacks={filtered} />
    </div>
  );
}
