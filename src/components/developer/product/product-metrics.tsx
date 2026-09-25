import { Users, Activity, Zap, AlertOctagon } from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductMetricsProps {
  product: Product;
}

export function ProductMetrics({ product }: ProductMetricsProps) {
  const activePercent = Math.round((product.activeUsers / product.totalUsers) * 100);

  const metrics = [
    {
      label: 'Total Users',
      value: product.totalUsers.toLocaleString(),
      sub: `${activePercent}% active`,
      icon: Users,
      color: 'text-violet-600',
    },
    {
      label: 'Avg Response Time',
      value: `${product.metrics.avgResponseTime}ms`,
      sub: product.metrics.avgResponseTime > 1000 ? 'Slower than target' : 'Within target',
      icon: Zap,
      color: product.metrics.avgResponseTime > 1000 ? 'text-orange-600' : 'text-green-600',
    },
    {
      label: 'Crash Rate',
      value: `${product.metrics.crashRate}%`,
      sub: product.metrics.crashRate > 1 ? 'Above healthy threshold' : 'Healthy',
      icon: AlertOctagon,
      color: product.metrics.crashRate > 1 ? 'text-red-600' : 'text-green-600',
    },
    {
      label: 'Satisfaction Score',
      value: `${product.metrics.satisfactionScore.toFixed(1)}/5`,
      sub: product.metrics.satisfactionScore >= 4 ? 'Strong' : product.metrics.satisfactionScore >= 3 ? 'Moderate' : 'Low',
      icon: Activity,
      color:
        product.metrics.satisfactionScore >= 4
          ? 'text-green-600'
          : product.metrics.satisfactionScore >= 3
            ? 'text-orange-600'
            : 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {metrics.map(metric => (
        <div key={metric.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-slate-600 font-medium">{metric.label}</div>
            <metric.icon className={`w-4 h-4 ${metric.color}`} />
          </div>
          <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
          <div className={`text-xs mt-1 ${metric.color}`}>{metric.sub}</div>
        </div>
      ))}
    </div>
  );
}
