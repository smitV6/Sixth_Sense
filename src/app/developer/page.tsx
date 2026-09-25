import { mockData } from '@/lib/mock-data';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

export default function DeveloperDashboard() {
  const { stats, projects, insights } = mockData.developer;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-slate-600 text-lg">Here's what Sixth Sense noticed across your projects.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-600 font-medium">Active Projects</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{stats.activeProjects}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-600 font-medium">Pending Requirements</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{stats.pendingRequirements}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-600 font-medium">GitHub Activity</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{stats.githubActivity}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-600 font-medium">User Feedback</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{stats.userFeedback.toLocaleString()}</div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Sixth Sense noticed...</h2>
        <div className="grid gap-4">
          {insights.map(insight => {
            const Icon = insight.severity === 'critical' ? AlertCircle : insight.severity === 'high' ? AlertTriangle : Info;
            const bgColor =
              insight.severity === 'critical' ? 'bg-red-50' : insight.severity === 'high' ? 'bg-orange-50' : 'bg-blue-50';
            const borderColor =
              insight.severity === 'critical' ? 'border-l-red-500' : insight.severity === 'high' ? 'border-l-orange-500' : 'border-l-blue-500';
            const textColor =
              insight.severity === 'critical' ? 'text-red-900' : insight.severity === 'high' ? 'text-orange-900' : 'text-blue-900';

            return (
              <div key={insight.id} className={`p-6 rounded-xl border-l-4 ${bgColor} ${borderColor}`}>
                <div className={`font-bold ${textColor} flex items-center gap-2`}>
                  <Icon className="w-5 h-5" />
                  <span className="uppercase text-sm">{insight.severity}</span>
                </div>
                <p className={`${textColor} mt-2`}>{insight.title}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Active Projects</h2>
        <div className="grid gap-4">
          {projects.map(project => (
            <div key={project.id} className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">{project.name}</h3>
                <div className="text-2xl font-bold text-violet-600">{project.progress}%</div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 mt-4">
                <div
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 h-2 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
