import { AlertCircle, CheckCircle } from 'lucide-react';
import { ProjectHealth } from '@/lib/types';

interface ProjectHealthIndicatorProps {
  health: ProjectHealth | undefined;
  compact?: boolean;
}

export function ProjectHealthIndicator({ health, compact = false }: ProjectHealthIndicatorProps) {
  if (!health) {
    return (
      <div className="text-slate-500">
        <p className="text-sm">Health data unavailable</p>
      </div>
    );
  }

  const score = health.score;
  const status = score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor';
  const statusColor =
    status === 'excellent' ? 'text-green-600' :
    status === 'good' ? 'text-blue-600' :
    status === 'fair' ? 'text-orange-600' :
    'text-red-600';

  const bgColor =
    status === 'excellent' ? 'bg-green-50' :
    status === 'good' ? 'bg-blue-50' :
    status === 'fair' ? 'bg-orange-50' :
    'bg-red-50';

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`text-2xl font-bold ${statusColor}`}>{score}%</div>
        <div className="text-xs text-slate-600 capitalize">{status}</div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg border ${bgColor}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-slate-900">Project Health</h4>
        <div className={`text-3xl font-bold ${statusColor}`}>{score}%</div>
      </div>

      <div className="text-sm text-slate-700 capitalize mb-3">{status}</div>

      <div className="space-y-2">
        {health.reasons.map((reason, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
            {reason.includes('good') || reason.includes('ahead') || reason.includes('excellent') || reason.includes('strong') ? (
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
            )}
            <span>{reason}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
