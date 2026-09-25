import { mockData } from '@/lib/mock-data';
import { TrendingUp, AlertCircle, Zap } from 'lucide-react';

export default function ClientDashboard() {
  const { stats, projects, insights } = mockData.client;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-slate-600 text-lg">Let's turn your ideas into better products.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-600 font-medium">Active Projects</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{stats.activeProjects}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-600 font-medium">Completed</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{stats.completed}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-600 font-medium">AI Suggestions</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{stats.aiSuggestions}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-600 font-medium">Developers</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{stats.developers}</div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Projects</h2>
        <div className="grid gap-4">
          {projects.map(project => (
            <div key={project.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-indigo-300 transition">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{project.name}</h3>
                  <p className="text-slate-600">{project.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">{project.progress}%</div>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 h-2 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <button className="mt-4 px-4 py-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm">
                View Project →
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Sixth Sense Insights</h2>
        <div className="grid gap-4">
          {insights.map(insight => (
            <div
              key={insight.id}
              className={`p-6 rounded-xl border-l-4 ${
                insight.type === 'urgent'
                  ? 'bg-red-50 border-l-red-500'
                  : insight.type === 'warning'
                    ? 'bg-yellow-50 border-l-yellow-500'
                    : 'bg-blue-50 border-l-blue-500'
              }`}
            >
              <div className="font-bold text-slate-900">{insight.title}</div>
              <p className="text-slate-600 text-sm mt-1">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
