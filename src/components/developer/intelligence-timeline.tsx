'use client';

import { Project, Feedback } from '@/lib/types';
import {
  CheckCircle2,
  Code,
  MessageSquare,
  AlertCircle,
  Sparkles,
  Clock,
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  type: 'requirement' | 'development' | 'feedback' | 'insight' | 'alert';
  label: string;
  timestamp: number;
  description: string;
}

interface IntelligenceTimelineProps {
  project: Project;
  feedback: Feedback[];
}

export function IntelligenceTimeline({ project, feedback }: IntelligenceTimelineProps) {
  const events: TimelineEvent[] = [];

  // Add requirement events
  [...project.coreRequirements, ...project.addedRequirements].forEach(req => {
    events.push({
      id: `req-${req.id}`,
      type: 'requirement',
      label: `Requirement: ${req.name}`,
      timestamp: project.createdAt,
      description: `${req.priority || 'medium'}-priority requirement added`,
    });

    if (req.status === 'completed' && req.completedAt) {
      events.push({
        id: `complete-${req.id}`,
        type: 'development',
        label: `Completed: ${req.name}`,
        timestamp: req.completedAt,
        description: 'Requirement marked as complete',
      });
    }
  });

  // Add commit events
  (project.commits || []).slice(0, 5).forEach(commit => {
    events.push({
      id: `commit-${commit.id}`,
      type: 'development',
      label: `Commit: ${commit.message}`,
      timestamp: commit.timestamp,
      description: `${commit.filesChanged} files changed`,
    });
  });

  // Add feedback clusters
  const feedbackClusters = feedback
    .reduce(
      (acc, f) => {
        const key = f.category;
        if (!acc[key]) acc[key] = [];
        acc[key].push(f);
        return acc;
      },
      {} as Record<string, Feedback[]>,
    );

  Object.entries(feedbackClusters)
    .slice(0, 3)
    .forEach(([category, items], index) => {
      events.push({
        id: `feedback-${category}`,
        type: 'feedback',
        label: `User feedback: ${category}`,
        timestamp: project.createdAt + (index + 1) * 86400000,
        description: `${items.length} reports in ${category} category`,
      });
    });

  // Add scope alerts
  (project.scopeAlerts || []).slice(0, 2).forEach(alert => {
    events.push({
      id: `scope-${alert.id}`,
      type: 'alert',
      label: `Scope alert: ${alert.feature}`,
      timestamp: alert.createdAt,
      description: `${alert.severity} - ${alert.description}`,
    });
  });

  // Sort by timestamp
  events.sort((a, b) => a.timestamp - b.timestamp);

  const iconMap = {
    requirement: <CheckCircle2 className="w-5 h-5 text-indigo-600" />,
    development: <Code className="w-5 h-5 text-green-600" />,
    feedback: <MessageSquare className="w-5 h-5 text-blue-600" />,
    insight: <Sparkles className="w-5 h-5 text-violet-600" />,
    alert: <AlertCircle className="w-5 h-5 text-orange-600" />,
  };

  const colorMap = {
    requirement: 'bg-indigo-50 border-indigo-200',
    development: 'bg-green-50 border-green-200',
    feedback: 'bg-blue-50 border-blue-200',
    insight: 'bg-violet-50 border-violet-200',
    alert: 'bg-orange-50 border-orange-200',
  };

  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <div className="text-center py-12 text-slate-600">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p>No lifecycle events yet</p>
        </div>
      ) : (
        events.map((event, idx) => (
          <div key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="rounded-full p-2 bg-white border-2 border-slate-200">{iconMap[event.type]}</div>
              {idx < events.length - 1 && <div className="w-0.5 h-16 bg-slate-200 mt-2" />}
            </div>

            <div className={`flex-1 p-4 rounded-xl border-2 ${colorMap[event.type]}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{event.label}</div>
                  <p className="text-sm text-slate-600 mt-1">{event.description}</p>
                </div>
                <div className="text-xs text-slate-500 whitespace-nowrap ml-4">
                  {new Date(event.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
