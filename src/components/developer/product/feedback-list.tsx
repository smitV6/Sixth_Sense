import { MessageCircle, Star, Users, Megaphone, ClipboardList, Mic } from 'lucide-react';
import { Feedback } from '@/lib/types';

interface FeedbackListProps {
  feedbacks: Feedback[];
}

const sourceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  in_app: MessageCircle,
  support: Users,
  review: Star,
  survey: ClipboardList,
  social: Megaphone,
  interview: Mic,
};

const sourceLabels: Record<string, string> = {
  in_app: 'In-App',
  support: 'Support Ticket',
  review: 'App Review',
  survey: 'Survey',
  social: 'Social Media',
  interview: 'User Interview',
};

const sentimentColors: Record<string, string> = {
  positive: 'bg-green-100 text-green-800',
  neutral: 'bg-slate-100 text-slate-700',
  negative: 'bg-red-100 text-red-800',
};

const priorityColors: Record<string, string> = {
  critical: 'bg-red-600 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-400 text-yellow-900',
  low: 'bg-slate-200 text-slate-700',
};

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  reviewing: 'bg-purple-100 text-purple-800',
  planned: 'bg-indigo-100 text-indigo-800',
  in_progress: 'bg-amber-100 text-amber-800',
  resolved: 'bg-green-100 text-green-800',
  dismissed: 'bg-slate-100 text-slate-500',
};

export function FeedbackList({ feedbacks }: FeedbackListProps) {
  if (feedbacks.length === 0) {
    return (
      <div className="p-8 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-center">
        <p className="text-slate-600 font-medium">No feedback matches your filters</p>
        <p className="text-slate-500 text-sm mt-1">Try adjusting search terms or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {feedbacks.map(fb => {
        const SourceIcon = sourceIcons[fb.source] || MessageCircle;
        return (
          <div key={fb.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <SourceIcon className="w-4 h-4" />
                <span>{sourceLabels[fb.source]}</span>
                <span>&middot;</span>
                <span>{fb.userName}</span>
                <span>&middot;</span>
                <span>{new Date(fb.date).toLocaleDateString()}</span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${priorityColors[fb.priority]}`}>{fb.priority}</span>
            </div>

            <p className="text-slate-800 mb-3">{fb.text}</p>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${sentimentColors[fb.sentiment]}`}>
                {fb.sentiment}
              </span>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-violet-100 text-violet-800 capitalize">
                {fb.aiClassification}
              </span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[fb.status]}`}>
                {fb.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
