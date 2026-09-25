'use client';

import { Search } from 'lucide-react';
import { FeedbackSentiment, FeedbackSource, FeedbackAIClassification, FeedbackStatus } from '@/lib/types';

export interface FeedbackFilters {
  query: string;
  sentiment: FeedbackSentiment | 'all';
  source: FeedbackSource | 'all';
  classification: FeedbackAIClassification | 'all';
  status: FeedbackStatus | 'all';
}

interface FeedbackSearchProps {
  filters: FeedbackFilters;
  onChange: (filters: FeedbackFilters) => void;
  resultCount: number;
  totalCount: number;
}

export function FeedbackSearch({ filters, onChange, resultCount, totalCount }: FeedbackSearchProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search feedback text, user name..."
          value={filters.query}
          onChange={e => onChange({ ...filters, query: e.target.value })}
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <select
          value={filters.sentiment}
          onChange={e => onChange({ ...filters, sentiment: e.target.value as FeedbackFilters['sentiment'] })}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300"
        >
          <option value="all">All Sentiments</option>
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </select>

        <select
          value={filters.source}
          onChange={e => onChange({ ...filters, source: e.target.value as FeedbackFilters['source'] })}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300"
        >
          <option value="all">All Sources</option>
          <option value="in_app">In-App</option>
          <option value="support">Support</option>
          <option value="review">Review</option>
          <option value="survey">Survey</option>
          <option value="social">Social</option>
          <option value="interview">Interview</option>
        </select>

        <select
          value={filters.classification}
          onChange={e => onChange({ ...filters, classification: e.target.value as FeedbackFilters['classification'] })}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300"
        >
          <option value="all">All Categories</option>
          <option value="bug">Bug</option>
          <option value="feature">Feature</option>
          <option value="ux">UX</option>
          <option value="performance">Performance</option>
          <option value="positive">Positive</option>
          <option value="other">Other</option>
        </select>

        <select
          value={filters.status}
          onChange={e => onChange({ ...filters, status: e.target.value as FeedbackFilters['status'] })}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300"
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="reviewing">Reviewing</option>
          <option value="planned">Planned</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>

      <div className="text-xs text-slate-500">
        Showing {resultCount} of {totalCount} feedback entries
      </div>
    </div>
  );
}
