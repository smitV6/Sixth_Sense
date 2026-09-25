import { CheckCircle, AlertTriangle } from 'lucide-react';

interface ProductHealthCardProps {
  score: number;
  reasons: string[];
}

export function ProductHealthCard({ score, reasons }: ProductHealthCardProps) {
  const status = score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'needs attention';
  const statusColor =
    score >= 80 ? 'text-green-600' : score >= 60 ? 'text-blue-600' : score >= 40 ? 'text-orange-600' : 'text-red-600';
  const bgColor =
    score >= 80 ? 'bg-green-50' : score >= 60 ? 'bg-blue-50' : score >= 40 ? 'bg-orange-50' : 'bg-red-50';
  const ringColor =
    score >= 80 ? 'stroke-green-500' : score >= 60 ? 'stroke-blue-500' : score >= 40 ? 'stroke-orange-500' : 'stroke-red-500';

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 text-lg">Product Health</h3>
        <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${bgColor} ${statusColor}`}>{status}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-100" />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={ringColor}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${statusColor}`}>{score}</span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {reasons.map((reason, idx) => {
            const isPositive = /good|strong|excellent|improv|resolution/i.test(reason);
            const Icon = isPositive ? CheckCircle : AlertTriangle;
            return (
              <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isPositive ? 'text-green-600' : 'text-orange-600'}`} />
                <span>{reason}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
