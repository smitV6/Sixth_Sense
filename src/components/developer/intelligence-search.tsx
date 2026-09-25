'use client';

import { useState, useMemo } from 'react';
import { Project, Feedback } from '@/lib/types';
import {
  Search,
  FileText,
  Code,
  MessageSquare,
  AlertCircle,
  X,
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'requirement' | 'commit' | 'feedback' | 'insight' | 'alert';
  title: string;
  description: string;
  metadata: string;
  icon: React.ReactNode;
}

interface IntelligenceSearchProps {
  project: Project;
  feedback: Feedback[];
}

export function IntelligenceSearch({ project, feedback }: IntelligenceSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo<SearchResult[]>(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const allResults: SearchResult[] = [];

    // Search requirements
    [...project.coreRequirements, ...project.addedRequirements].forEach(req => {
      if (req.name.toLowerCase().includes(query) || req.description?.toLowerCase().includes(query)) {
        allResults.push({
          id: `req-${req.id}`,
          type: 'requirement',
          title: req.name,
          description: req.description || '',
          metadata: `${req.status} • ${req.priority || 'medium'} priority`,
          icon: <FileText className="w-4 h-4 text-indigo-600" />,
        });
      }
    });

    // Search commits
    (project.commits || []).forEach(commit => {
      if (commit.message.toLowerCase().includes(query)) {
        allResults.push({
          id: `commit-${commit.id}`,
          type: 'commit',
          title: commit.message,
          description: `By ${commit.developer}`,
          metadata: `${commit.filesChanged} files • ${new Date(commit.timestamp).toLocaleDateString()}`,
          icon: <Code className="w-4 h-4 text-green-600" />,
        });
      }
    });

    // Search feedback
    feedback.forEach(f => {
      if (f.text.toLowerCase().includes(query)) {
        allResults.push({
          id: `feedback-${f.id}`,
          type: 'feedback',
          title: f.text.substring(0, 60),
          description: `From ${f.userName}`,
          metadata: `${f.sentiment} • ${f.category} • ${f.source}`,
          icon: <MessageSquare className="w-4 h-4 text-blue-600" />,
        });
      }
    });

    // Search scope alerts
    (project.scopeAlerts || []).forEach(alert => {
      if (alert.feature.toLowerCase().includes(query) || alert.description.toLowerCase().includes(query)) {
        allResults.push({
          id: `scope-${alert.id}`,
          type: 'alert',
          title: alert.feature,
          description: alert.description,
          metadata: `${alert.severity} • ${alert.type}`,
          icon: <AlertCircle className="w-4 h-4 text-orange-600" />,
        });
      }
    });

    return allResults.slice(0, 10);
  }, [searchQuery, project, feedback]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search requirements, code, feedback, insights..."
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 bg-white"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-100 rounded"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {isOpen && searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-lg shadow-xl z-10 max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              <p>No results for &quot;{searchQuery}&quot;</p>
            </div>
          ) : (
            <div className="divide-y">
              {results.map(result => (
                <button
                  key={result.id}
                  onClick={() => {
                    setSearchQuery('');
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 transition flex items-start gap-3 group"
                >
                  <div className="mt-1 flex-shrink-0">{result.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 group-hover:text-indigo-600 transition truncate">
                      {result.title}
                    </div>
                    <div className="text-sm text-slate-600 truncate">{result.description}</div>
                    <div className="text-xs text-slate-500 mt-1">{result.metadata}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {isOpen && !searchQuery && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
