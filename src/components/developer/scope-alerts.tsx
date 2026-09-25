import { AlertTriangle, CheckCircle2, X, Info } from 'lucide-react';
import { ScopeAlert } from '@/lib/types';
import { useState } from 'react';

interface ScopeAlertsProps {
  alerts: ScopeAlert[] | undefined;
  onApprove?: (alertId: string) => void;
  onReject?: (alertId: string) => void;
}

export function ScopeAlerts({ alerts, onApprove, onReject }: ScopeAlertsProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  if (!alerts || alerts.length === 0) {
    return (
      <div className="p-6 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <p className="text-slate-700 font-medium">No scope alerts</p>
        <p className="text-slate-500 text-sm mt-1">Your project is well within scope</p>
      </div>
    );
  }

  const activeAlerts = alerts.filter(a => !dismissedAlerts.has(a.id));

  return (
    <div className="space-y-3">
      {activeAlerts.map(alert => {
        const bgColor =
          alert.severity === 'critical'
            ? 'bg-red-50 border-l-red-500'
            : alert.severity === 'high'
              ? 'bg-orange-50 border-l-orange-500'
              : 'bg-yellow-50 border-l-yellow-500';

        const textColor =
          alert.severity === 'critical'
            ? 'text-red-900'
            : alert.severity === 'high'
              ? 'text-orange-900'
              : 'text-yellow-900';

        const badgeColor =
          alert.severity === 'critical'
            ? 'bg-red-200 text-red-900'
            : alert.severity === 'high'
              ? 'bg-orange-200 text-orange-900'
              : 'bg-yellow-200 text-yellow-900';

        return (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border-l-4 ${bgColor} space-y-3`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className={`font-bold flex items-center gap-2 ${textColor}`}>
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {alert.feature}
                </div>
                <p className={`text-sm mt-2 ${textColor}`}>{alert.description}</p>
              </div>
              <div className="flex-shrink-0">
                <span className={`text-xs font-bold px-2 py-1 rounded ${badgeColor}`}>
                  {alert.severity}
                </span>
              </div>
            </div>

            <div className={`p-3 rounded bg-white bg-opacity-50 border border-current border-opacity-20 text-sm ${textColor}`}>
              <div className="flex gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Recommendation:</strong> {alert.recommendation}
                </div>
              </div>
            </div>

            {alert.status === 'open' && (
              <div className="flex gap-2 pt-2">
                {onApprove && (
                  <button
                    onClick={() => onApprove(alert.id)}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition"
                  >
                    Approve Addition
                  </button>
                )}
                {onReject && (
                  <button
                    onClick={() => onReject(alert.id)}
                    className="flex-1 px-3 py-2 bg-slate-200 text-slate-900 rounded text-sm font-medium hover:bg-slate-300 transition"
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => setDismissedAlerts(new Set([...dismissedAlerts, alert.id]))}
                  className="px-3 py-2 bg-slate-200 text-slate-600 rounded text-sm hover:bg-slate-300 transition"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
