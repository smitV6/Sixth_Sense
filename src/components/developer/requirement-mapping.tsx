import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { Requirement, GitCommit } from '@/lib/types';

interface RequirementMappingProps {
  requirements: Requirement[];
  commits: GitCommit[];
}

export function RequirementMapping({ requirements, commits }: RequirementMappingProps) {
  return (
    <div className="space-y-4">
      {requirements.map(req => {
        const matchedCommits = commits.filter(c => c.relatedRequirementId === req.id);
        const avgConfidence =
          matchedCommits.length > 0 ? matchedCommits.reduce((sum, c) => sum + (c.confidence || 0.85), 0) / matchedCommits.length : 0;

        const statusIcon =
          req.status === 'completed' ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : req.status === 'in_progress' ? (
            <Circle className="w-6 h-6 text-blue-600" />
          ) : (
            <Circle className="w-6 h-6 text-slate-300" />
          );

        return (
          <div key={req.id} className="p-4 border border-slate-200 rounded-lg hover:border-violet-300 transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {statusIcon}
                  <div>
                    <h4 className="font-semibold text-slate-900">{req.name}</h4>
                    <p className="text-sm text-slate-600 mt-1">{req.description}</p>
                  </div>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="text-xs text-slate-600 mb-1">Coverage</div>
                <div className="text-xl font-bold text-violet-600">{matchedCommits.length}</div>
              </div>
            </div>

            {matchedCommits.length > 0 ? (
              <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                <div className="text-xs font-semibold text-slate-600">Matched Commits ({matchedCommits.length}):</div>
                {matchedCommits.map(commit => (
                  <div key={commit.id} className="text-xs p-2.5 bg-violet-50 border border-violet-200 rounded">
                    <div className="font-medium text-violet-900 truncate">{commit.message}</div>
                    <div className="flex items-center justify-between mt-1 text-violet-700">
                      <span>{commit.developer}</span>
                      <span className="font-semibold">
                        {Math.round((commit.confidence || 0.85) * 100)}% match
                      </span>
                    </div>
                  </div>
                ))}
                {matchedCommits.length > 3 && (
                  <div className="text-xs text-slate-500 italic">+{matchedCommits.length - 3} more commits</div>
                )}
              </div>
            ) : (
              <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5" />
                No commits matched to this requirement yet
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
