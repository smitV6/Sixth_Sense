'use client';

import { useState } from 'react';
import { useProjectStore } from '@/lib/project-store';
import { useToastStore } from '@/lib/toast-store';
import { MOCK_FEEDBACK } from '@/lib/mock-feedback-data';
import {
  analyzeRequirementIntelligence,
  generateExecutiveSummary,
  generateRecommendations,
  generateIntelligenceSignals,
  generateSprintSuggestion,
  detectScopeOpportunities,
} from '@/lib/intelligence-service';
import {
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Zap,
  ChevronRight,
  Eye,
  Clock,
} from 'lucide-react';
import { IntelligenceTimeline } from '@/components/developer/intelligence-timeline';
import { IntelligenceSearch } from '@/components/developer/intelligence-search';

const CURRENT_PROJECT_ID = 'stylecart-dev';

export default function IntelligenceHubPage() {
  const getProject = useProjectStore(state => state.getProject);
  const { addToast } = useToastStore();
  const project = getProject(CURRENT_PROJECT_ID);
  const [expandedSection, setExpandedSection] = useState<string>('signals');
  const [showSprintGenerator, setShowSprintGenerator] = useState(false);
  const [showExplanation, setShowExplanation] = useState<string | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<string | null>(null);
  const [acceptedSprint, setAcceptedSprint] = useState(false);

  if (!project) {
    return <div className="text-center py-12">Project not found</div>;
  }

  const allRequirements = [...project.coreRequirements, ...project.addedRequirements];
  const requirementAnalyses = allRequirements.map(req =>
    analyzeRequirementIntelligence(req, allRequirements, project, MOCK_FEEDBACK),
  );
  const summary = generateExecutiveSummary(project, MOCK_FEEDBACK, requirementAnalyses);
  const recommendations = generateRecommendations(project, MOCK_FEEDBACK, requirementAnalyses);
  const signals = generateIntelligenceSignals(project, MOCK_FEEDBACK, requirementAnalyses);
  const scopeOpportunities = detectScopeOpportunities(project, MOCK_FEEDBACK);
  const sprintSuggestion = generateSprintSuggestion(project, MOCK_FEEDBACK, requirementAnalyses);

  const statusColor =
    summary.productStatus === 'Excellent'
      ? 'bg-green-50 border-green-200'
      : summary.productStatus === 'At risk'
        ? 'bg-red-50 border-red-200'
        : 'bg-yellow-50 border-yellow-200';

  const statusTextColor =
    summary.productStatus === 'Excellent'
      ? 'text-green-900'
      : summary.productStatus === 'At risk'
        ? 'text-red-900'
        : 'text-yellow-900';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Sixth Sense Intelligence</h1>
        <p className="text-slate-600 mt-2">Connected intelligence across requirements, development, and user feedback</p>
      </div>

      {/* Global Search */}
      <div className="max-w-2xl">
        <IntelligenceSearch project={project} feedback={MOCK_FEEDBACK} />
      </div>

      {/* Executive Summary Card */}
      <div className={`border-2 rounded-xl p-8 ${statusColor}`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${statusTextColor}`}>{project.name} Status: {summary.productStatus}</h2>
            <p className="text-slate-600 mt-2 text-lg leading-relaxed">{summary.keyInsights.join(' ')}</p>
          </div>
          <div className="text-4xl font-bold text-slate-900">{summary.progressMetrics.developmentHealth}/100</div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t-2 border-current border-opacity-10">
          <div>
            <div className="text-sm text-slate-600">Requirements</div>
            <div className="text-3xl font-bold text-slate-900">
              {summary.progressMetrics.requirementsCompleted}/{summary.progressMetrics.totalRequirements}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              {Math.round((summary.progressMetrics.requirementsCompleted / summary.progressMetrics.totalRequirements) * 100)}% complete
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-600">User Feedback</div>
            <div className="text-3xl font-bold text-slate-900">{summary.feedbackMetrics.userComplaints}</div>
            <div className="text-xs text-slate-600 mt-1">Issues reported</div>
          </div>
          <div>
            <div className="text-sm text-slate-600">Risk Level</div>
            <div className="text-3xl font-bold text-slate-900">{summary.riskMetrics.highRiskCount}</div>
            <div className="text-xs text-slate-600 mt-1">
              High-priority unresolved {summary.riskMetrics.highRiskCount === 1 ? 'issue' : 'issues'}
            </div>
          </div>
        </div>
      </div>

      {/* Key Signals Dashboard */}
      <section>
        <button
          onClick={() => setExpandedSection(expandedSection === 'signals' ? '' : 'signals')}
          className="w-full flex items-center justify-between mb-4 group"
        >
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-6 h-6 text-violet-600" />
            What&apos;s Happening Right Now?
          </h2>
          <ChevronRight className={`w-6 h-6 text-slate-400 transition-transform ${expandedSection === 'signals' ? 'rotate-90' : ''}`} />
        </button>

        {expandedSection === 'signals' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {signals.map(signal => (
              <div key={signal.category} className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-violet-300 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm text-slate-600">{signal.category}</div>
                    <div className="text-3xl font-bold text-slate-900 mt-1">{signal.value}</div>
                  </div>
                  {signal.trend && (
                    <TrendingUp
                      className={`w-5 h-5 ${signal.trend === 'up' ? 'text-red-600 rotate-90' : 'text-green-600'}`}
                    />
                  )}
                </div>
                <p className="text-sm text-slate-600">{signal.label}</p>
                <p className="text-xs text-slate-500 mt-2">{signal.insight}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Requirement Intelligence */}
      <section>
        <button
          onClick={() => setExpandedSection(expandedSection === 'requirements' ? '' : 'requirements')}
          className="w-full flex items-center justify-between mb-4 group"
        >
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-indigo-600" />
            Requirement ↔ Development ↔ Feedback
          </h2>
          <ChevronRight className={`w-6 h-6 text-slate-400 transition-transform ${expandedSection === 'requirements' ? 'rotate-90' : ''}`} />
        </button>

        {expandedSection === 'requirements' && (
          <div className="space-y-4">
            {requirementAnalyses.slice(0, 5).map(analysis => (
              <div
                key={analysis.requirement.id}
                className={`p-6 rounded-xl border-2 transition-all ${
                  analysis.riskLevel === 'critical'
                    ? 'border-red-300 bg-red-50'
                    : analysis.riskLevel === 'high'
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-slate-200 bg-white'
                }`}
              >
                <div className="grid md:grid-cols-4 gap-6 mb-4">
                  <div>
                    <div className="text-sm text-slate-600">Requirement</div>
                    <div className="font-bold text-slate-900 mt-1">{analysis.requirement.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Development</div>
                    <div className="text-sm font-semibold text-slate-900 mt-1">
                      {analysis.implementationStatus === 'complete'
                        ? '✓ Implemented'
                        : analysis.implementationStatus === 'partial'
                          ? '◐ In Progress'
                          : '○ Not Started'}
                    </div>
                    <div className="text-xs text-slate-600">{analysis.developmentEvidence} commits</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">User Feedback</div>
                    <div className="text-sm font-semibold text-slate-900 mt-1">
                      {analysis.feedbackCount > 0 ? (
                        <span className={analysis.feedbackSentiment === 'positive' ? 'text-green-700' : 'text-red-700'}>
                          {analysis.feedbackCount} reports ({analysis.feedbackSentiment})
                        </span>
                      ) : (
                        'No feedback'
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Risk Level</div>
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                        analysis.riskLevel === 'critical'
                          ? 'bg-red-200 text-red-900'
                          : analysis.riskLevel === 'high'
                            ? 'bg-orange-200 text-orange-900'
                            : analysis.riskLevel === 'medium'
                              ? 'bg-yellow-200 text-yellow-900'
                              : 'bg-green-200 text-green-900'
                      }`}
                    >
                      {analysis.riskLevel}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-current border-opacity-20">
                  <p className="text-sm text-slate-700">{analysis.aiAssessment}</p>
                  {analysis.userComplaints.length > 0 && (
                    <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-lg">
                      <div className="text-xs font-semibold text-slate-700 mb-2">Sample feedback:</div>
                      <blockquote className="text-sm text-slate-600 italic border-l-2 border-current pl-3">
                        &quot;{analysis.userComplaints[0]}&quot;
                      </blockquote>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Scope + Demand Connection */}
      {scopeOpportunities.length > 0 && (
        <section>
          <button
            onClick={() => setExpandedSection(expandedSection === 'scope' ? '' : 'scope')}
            className="w-full flex items-center justify-between mb-4 group"
          >
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Scope Creep + User Demand
            </h2>
            <ChevronRight className={`w-6 h-6 text-slate-400 transition-transform ${expandedSection === 'scope' ? 'rotate-90' : ''}`} />
          </button>

          {expandedSection === 'scope' && (
            <div className="space-y-4">
              {scopeOpportunities.map(opp => (
                <div key={opp.feature} className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{opp.feature}</h3>
                      <p className="text-sm text-slate-600 mt-1">{opp.reasoning}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-700">{opp.userDemand}</div>
                      <div className="text-xs text-slate-600">users requested</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-green-200">
                    {opp.userFeedback.map((feedback, i) => (
                      <blockquote key={i} className="text-sm text-slate-600 italic border-l-2 border-green-400 pl-3">
                        &quot;{feedback}&quot;
                      </blockquote>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2">
                    {opp.recommendation === 'add_to_scope' && (
                      <button
                        onClick={() => {
                          addToast(`Added "${opp.feature}" to scope for review`, 'success');
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition"
                      >
                        Add to Scope
                      </button>
                    )}
                    <button
                      onClick={() => {
                        addToast(`Viewing details for: ${opp.feature}`, 'info');
                      }}
                      className="px-4 py-2 border-2 border-slate-300 text-slate-900 rounded-lg hover:bg-slate-50 text-sm font-medium transition"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Prioritization Engine */}
      <section>
        <button
          onClick={() => setExpandedSection(expandedSection === 'recommendations' ? '' : 'recommendations')}
          className="w-full flex items-center justify-between mb-4 group"
        >
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            Recommended Next Actions
          </h2>
          <ChevronRight className={`w-6 h-6 text-slate-400 transition-transform ${expandedSection === 'recommendations' ? 'rotate-90' : ''}`} />
        </button>

        {expandedSection === 'recommendations' && (
          <div className="space-y-4">
            {recommendations.slice(0, 6).map((rec, idx) => (
              <div key={rec.id} className="bg-white p-6 rounded-xl border-2 border-slate-200">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
                      rec.priority === 'critical'
                        ? 'bg-red-600'
                        : rec.priority === 'high'
                          ? 'bg-orange-600'
                          : rec.priority === 'medium'
                            ? 'bg-yellow-600'
                            : 'bg-blue-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-slate-900">{rec.action}</h3>
                      <button
                        onClick={() => setShowExplanation(showExplanation === rec.id ? null : rec.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                      >
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>

                    {showExplanation === rec.id && (
                      <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                        <div className="text-sm font-semibold text-slate-900 mb-2">Why?</div>
                        <ul className="space-y-1">
                          {rec.reasoning.map((reason, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                              <span className="text-violet-600 mt-1">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <p className="text-sm text-slate-600 mb-3">{rec.impact}</p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          addToast(`Started work on: ${rec.action}`, 'success');
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition"
                      >
                        Start Work
                      </button>
                      <button
                        onClick={() => setSelectedDetails(selectedDetails === rec.id ? null : rec.id)}
                        className="px-4 py-2 border-2 border-slate-300 text-slate-900 rounded-lg hover:bg-slate-50 text-sm font-medium transition"
                      >
                        {selectedDetails === rec.id ? 'Hide' : 'Details'}
                      </button>
                    </div>
                    {selectedDetails === rec.id && (
                      <div className="mt-3 p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
                        <div className="text-sm font-semibold text-slate-900 mb-2">Recommendation Details</div>
                        <p className="text-sm text-slate-700">{rec.impact}</p>
                        <div className="mt-2 text-xs text-slate-600">
                          <strong>Effort:</strong> {rec.estimatedEffort || 'medium'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sprint Generator */}
      <section className="bg-gradient-to-br from-indigo-50 to-violet-50 p-8 rounded-xl border-2 border-indigo-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Generate Next Sprint</h2>
            <p className="text-slate-600 mt-2">Let Sixth Sense create an optimized sprint plan based on all available intelligence</p>
          </div>
          <button
            onClick={() => setShowSprintGenerator(!showSprintGenerator)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition"
          >
            {showSprintGenerator ? 'Hide Sprint' : 'Generate Sprint'}
          </button>
        </div>

        {showSprintGenerator && (
          <div className="space-y-6 mt-6 pt-6 border-t-2 border-indigo-200">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Sprint Goal</h3>
              <p className="text-lg text-slate-700 p-4 bg-white bg-opacity-80 rounded-lg">{sprintSuggestion.goal}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Sprint Tasks</h3>
              <div className="space-y-3">
                {sprintSuggestion.tasks.map((task, idx) => (
                  <div key={task.id} className="bg-white bg-opacity-80 p-4 rounded-lg flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{task.title}</div>
                      <p className="text-sm text-slate-600 mt-1">{task.reason}</p>
                      <div className="flex gap-3 mt-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          task.priority === 'critical' ? 'bg-red-100 text-red-700' :
                          task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700">
                          {task.estimatedEffort} effort
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Expected Outcomes</h3>
              <ul className="space-y-2">
                {sprintSuggestion.expectedOutcomes.map((outcome, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 pt-6 border-t-2 border-indigo-200">
              <button
                onClick={() => {
                  setAcceptedSprint(true);
                  addToast('Sprint accepted! Ready to start development.', 'success');
                }}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition ${
                  acceptedSprint
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {acceptedSprint ? '✓ Sprint Accepted' : 'Accept Sprint'}
              </button>
              <button
                onClick={() => {
                  addToast('Sprint editing not yet available. Use "Accept Sprint" to proceed.', 'info');
                }}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-900 rounded-lg hover:bg-slate-50 font-semibold transition"
              >
                Edit & Customize
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Intelligence Timeline */}
      <section>
        <button
          onClick={() => setExpandedSection(expandedSection === 'timeline' ? '' : 'timeline')}
          className="w-full flex items-center justify-between mb-4 group"
        >
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-slate-600" />
            Product Lifecycle
          </h2>
          <ChevronRight className={`w-6 h-6 text-slate-400 transition-transform ${expandedSection === 'timeline' ? 'rotate-90' : ''}`} />
        </button>

        {expandedSection === 'timeline' && (
          <IntelligenceTimeline project={project} feedback={MOCK_FEEDBACK} />
        )}
      </section>

      {/* AI Alerts */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          AI Alerts
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {summary.riskMetrics.highRiskCount > 0 && (
            <div className="bg-red-50 border-2 border-red-300 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-red-900">High Priority Issues</div>
                  <p className="text-sm text-red-800 mt-1">
                    {summary.riskMetrics.highRiskCount} high-priority requirements remain unresolved
                  </p>
                </div>
              </div>
            </div>
          )}

          {summary.feedbackMetrics.userComplaints > 0 && (
            <div className="bg-orange-50 border-2 border-orange-300 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-orange-900">User Complaints</div>
                  <p className="text-sm text-orange-800 mt-1">
                    {summary.feedbackMetrics.userComplaints} users reported issues
                  </p>
                </div>
              </div>
            </div>
          )}

          {(project.scopeAlerts || []).length > 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-yellow-900">Scope Additions</div>
                  <p className="text-sm text-yellow-800 mt-1">
                    {project.scopeAlerts?.length} features appear outside original scope
                  </p>
                </div>
              </div>
            </div>
          )}

          {summary.feedbackMetrics.sentimentTrend === 'declining' && (
            <div className="bg-red-50 border-2 border-red-300 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-red-600 flex-shrink-0 mt-1 rotate-90" />
                <div>
                  <div className="font-bold text-red-900">Negative Trend</div>
                  <p className="text-sm text-red-800 mt-1">User sentiment is declining. Investigate urgently.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
