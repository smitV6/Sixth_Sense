import { Project, Feedback, Requirement, FeedbackCluster, ProductInsight, PriorityLevel } from './types';

export interface RequirementIntelligence {
  requirement: Requirement;
  implementationStatus: 'not_started' | 'partial' | 'complete';
  developmentEvidence: number; // commits count
  feedbackCount: number;
  feedbackSentiment: 'positive' | 'neutral' | 'negative';
  riskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  riskReasons: string[];
  userComplaints: string[];
  aiAssessment: string;
}

export interface ScopeOpportunity {
  feature: string;
  developmentEvidence: boolean;
  userDemand: number;
  userFeedback: string[];
  recommendation: 'add_to_scope' | 'future_feature' | 'out_of_scope';
  reasoning: string;
}

export interface IntelligenceSignal {
  category: string;
  value: number;
  label: string;
  trend?: 'up' | 'down' | 'stable';
  insight: string;
}

export interface ActionRecommendation {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  action: string;
  reasoning: string[];
  impact: string;
  relatedRequirementId?: string;
  relatedFeedback?: string[];
  estimatedEffort?: 'small' | 'medium' | 'large';
}

export interface SprintSuggestion {
  goal: string;
  tasks: SprintTask[];
  estimatedDuration: '1_week' | '2_weeks' | '3_weeks' | '4_weeks';
  expectedOutcomes: string[];
}

export interface SprintTask {
  id: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  reason: string;
  relatedRequirementId?: string;
  relatedFeedback?: string[];
  relatedCommitCount?: number;
  estimatedEffort: 'small' | 'medium' | 'large';
}

export interface ExecutiveIntelligenceSummary {
  productStatus: string;
  progressMetrics: {
    requirementsCompleted: number;
    totalRequirements: number;
    developmentHealth: number;
  };
  feedbackMetrics: {
    userComplaints: number;
    topIssues: string[];
    sentimentTrend: 'improving' | 'stable' | 'declining';
  };
  riskMetrics: {
    highRiskCount: number;
    scopeAdditions: number;
    recommendations: string[];
  };
  keyInsights: string[];
}

export function analyzeFeedbackForRequirement(
  requirement: Requirement,
  feedback: Feedback[],
): { count: number; sentiment: 'positive' | 'neutral' | 'negative'; samples: string[] } {
  const reqLower = requirement.name.toLowerCase();
  const related = feedback.filter(f => f.text.toLowerCase().includes(reqLower));

  if (related.length === 0) {
    return { count: 0, sentiment: 'neutral', samples: [] };
  }

  const positive = related.filter(f => f.sentiment === 'positive').length;
  const negative = related.filter(f => f.sentiment === 'negative').length;
  const neutral = related.length - positive - negative;

  const sentiment = negative > positive ? 'negative' : positive > negative ? 'positive' : 'neutral';
  const samples = related.slice(0, 3).map(f => f.text);

  return { count: related.length, sentiment, samples };
}

export function analyzeRequirementIntelligence(
  requirement: Requirement,
  allRequirements: Requirement[],
  project: Project,
  feedback: Feedback[],
): RequirementIntelligence {
  const feedbackAnalysis = analyzeFeedbackForRequirement(requirement, feedback);
  const commits = (project.commits || []).filter(c => c.relatedRequirementId === requirement.id);
  const scopeAlerts = (project.scopeAlerts || []).filter(a => a.description.includes(requirement.name));

  let implementationStatus: 'not_started' | 'partial' | 'complete' = 'not_started';
  if (requirement.status === 'completed') implementationStatus = 'complete';
  else if (commits.length > 0) implementationStatus = 'partial';

  const riskReasons: string[] = [];
  let riskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical' = 'none';

  if (requirement.status === 'pending' && requirement.priority === 'critical') {
    riskLevel = 'critical';
    riskReasons.push('High-priority requirement not started');
  } else if (requirement.status === 'pending' && requirement.priority === 'high') {
    riskLevel = 'high';
    riskReasons.push('High-priority requirement pending');
  }

  if (feedbackAnalysis.sentiment === 'negative' && feedbackAnalysis.count > 0) {
    riskReasons.push(`${feedbackAnalysis.count} users reported issues`);
    if (riskLevel === 'none') riskLevel = 'medium';
  }

  if (implementationStatus === 'partial' && feedbackAnalysis.sentiment === 'negative') {
    riskLevel = riskLevel === 'none' ? 'medium' : riskLevel;
    riskReasons.push('Implementation incomplete but users are reporting issues');
  }

  const aiAssessment =
    riskLevel === 'critical'
      ? `Critical: This core requirement is not started and users are reporting issues. Immediate action needed.`
      : riskLevel === 'high'
        ? `${requirement.name} is important but not completed. ${feedbackAnalysis.count > 0 ? `${feedbackAnalysis.count} users reported issues.` : ''}`
        : `${requirement.name} is ${implementationStatus}. ${feedbackAnalysis.count > 0 ? `User feedback: ${feedbackAnalysis.sentiment}.` : 'No user feedback yet.'}`;

  return {
    requirement,
    implementationStatus,
    developmentEvidence: commits.length,
    feedbackCount: feedbackAnalysis.count,
    feedbackSentiment: feedbackAnalysis.sentiment,
    riskLevel,
    riskReasons,
    userComplaints: feedbackAnalysis.samples,
    aiAssessment,
  };
}

export function detectScopeOpportunities(
  project: Project,
  feedback: Feedback[],
): ScopeOpportunity[] {
  const scopeAlerts = project.scopeAlerts || [];
  const opportunities: ScopeOpportunity[] = [];

  scopeAlerts.forEach(alert => {
    const featureLower = alert.feature.toLowerCase();
    const demandFeedback = feedback.filter(f => f.text.toLowerCase().includes(featureLower) && f.category === 'feature');

    if (demandFeedback.length > 0) {
      opportunities.push({
        feature: alert.feature,
        developmentEvidence: true,
        userDemand: demandFeedback.length,
        userFeedback: demandFeedback.slice(0, 2).map(f => f.text),
        recommendation: demandFeedback.length > 3 ? 'add_to_scope' : 'future_feature',
        reasoning: `Development has started (${alert.description}). ${demandFeedback.length} users requested this feature.`,
      });
    }
  });

  return opportunities;
}

export function generateRecommendations(
  project: Project,
  feedback: Feedback[],
  requirementAnalyses: RequirementIntelligence[],
): ActionRecommendation[] {
  const recommendations: ActionRecommendation[] = [];
  const allRequirements = [...project.coreRequirements, ...project.addedRequirements];

  requirementAnalyses.forEach((analysis, idx) => {
    if (analysis.riskLevel === 'critical') {
      recommendations.push({
        id: `critical-${idx}`,
        priority: 'critical',
        action: `Address ${analysis.requirement.name}`,
        reasoning: analysis.riskReasons,
        impact: `Required for product functionality. Users are affected.`,
        relatedRequirementId: analysis.requirement.id,
        relatedFeedback: analysis.userComplaints,
        estimatedEffort: 'large',
      });
    } else if (analysis.riskLevel === 'high') {
      recommendations.push({
        id: `high-${idx}`,
        priority: 'high',
        action: `Complete ${analysis.requirement.name}`,
        reasoning: analysis.riskReasons,
        impact: `High-priority requirement incomplete.`,
        relatedRequirementId: analysis.requirement.id,
        estimatedEffort: 'medium',
      });
    }
  });

  const scopeOpportunities = detectScopeOpportunities(project, feedback);
  scopeOpportunities.forEach((opp, idx) => {
    if (opp.recommendation === 'add_to_scope') {
      recommendations.push({
        id: `scope-${idx}`,
        priority: 'high',
        action: `Evaluate ${opp.feature} for approval`,
        reasoning: [`${opp.userDemand} users requested this feature`, 'Development has already started'],
        impact: `Could improve user satisfaction and product completeness.`,
        estimatedEffort: 'medium',
      });
    }
  });

  return recommendations.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

export function generateExecutiveSummary(
  project: Project,
  feedback: Feedback[],
  requirementAnalyses: RequirementIntelligence[],
): ExecutiveIntelligenceSummary {
  const allRequirements = [...project.coreRequirements, ...project.addedRequirements];
  const completedRequirements = allRequirements.filter(r => r.status === 'completed').length;

  const negativeCount = feedback.filter(f => f.sentiment === 'negative').length;
  const negativeSamples = feedback
    .filter(f => f.sentiment === 'negative')
    .slice(0, 3)
    .map(f => f.text);

  const criticalCount = requirementAnalyses.filter(a => a.riskLevel === 'critical').length;
  const highCount = requirementAnalyses.filter(a => a.riskLevel === 'high').length;

  const sentimentTrend: 'improving' | 'stable' | 'declining' =
    negativeCount > feedback.length * 0.4
      ? 'declining'
      : negativeCount < feedback.length * 0.3
        ? 'improving'
        : 'stable';

  const keyInsights: string[] = [];

  if (completedRequirements === allRequirements.length) {
    keyInsights.push('All requirements are complete! Focus now on user satisfaction.');
  } else if ((completedRequirements / allRequirements.length) * 100 >= 75) {
    keyInsights.push(`${completedRequirements}/${allRequirements.length} requirements implemented (${Math.round((completedRequirements / allRequirements.length) * 100)}%)`);
  } else {
    keyInsights.push(`Development is ${Math.round((completedRequirements / allRequirements.length) * 100)}% complete. ${allRequirements.length - completedRequirements} requirements remain.`);
  }

  if (negativeCount > 0) {
    keyInsights.push(`${negativeCount} users reported issues. Top concern: ${negativeSamples[0]?.substring(0, 60)}...`);
  }

  if ((project.scopeAlerts || []).length > 0) {
    keyInsights.push(`${project.scopeAlerts?.length || 0} potential scope additions detected.`);
  }

  const productStatus =
    sentimentTrend === 'declining'
      ? 'Needs attention'
      : criticalCount > 0
        ? 'At risk'
        : completedRequirements === allRequirements.length && sentimentTrend === 'improving'
          ? 'Excellent'
          : 'Good';

  return {
    productStatus,
    progressMetrics: {
      requirementsCompleted: completedRequirements,
      totalRequirements: allRequirements.length,
      developmentHealth: 100 - (criticalCount * 25 + highCount * 10),
    },
    feedbackMetrics: {
      userComplaints: negativeCount,
      topIssues: negativeSamples,
      sentimentTrend,
    },
    riskMetrics: {
      highRiskCount: criticalCount + highCount,
      scopeAdditions: (project.scopeAlerts || []).length,
      recommendations: generateRecommendations(project, feedback, requirementAnalyses)
        .slice(0, 3)
        .map(r => r.action),
    },
    keyInsights,
  };
}

export function generateSprintSuggestion(
  project: Project,
  feedback: Feedback[],
  requirementAnalyses: RequirementIntelligence[],
): SprintSuggestion {
  const recommendations = generateRecommendations(project, feedback, requirementAnalyses);
  const tasks: SprintTask[] = [];

  recommendations.slice(0, 5).forEach((rec, idx) => {
    tasks.push({
      id: `task-${idx}`,
      title: rec.action,
      description: rec.reasoning.join(' '),
      priority: rec.priority as any,
      reason: rec.reasoning[0] || rec.action,
      relatedRequirementId: rec.relatedRequirementId,
      relatedFeedback: rec.relatedFeedback,
      estimatedEffort: rec.estimatedEffort || 'medium',
    });
  });

  const allRequirements = [...project.coreRequirements, ...project.addedRequirements];
  const incompleteHigh = allRequirements.filter(r => r.status !== 'completed' && r.priority === 'high').length;

  let goal = 'Complete high-priority requirements and address user feedback';
  if (tasks.some(t => t.priority === 'critical')) {
    goal = 'Resolve critical issues and stabilize the product';
  }

  return {
    goal,
    tasks,
    estimatedDuration: tasks.length > 5 ? '4_weeks' : tasks.length > 3 ? '3_weeks' : '2_weeks',
    expectedOutcomes: [
      `${Math.min(tasks.length, 3)} high-priority tasks completed`,
      'Improved product stability',
      'User satisfaction increase',
    ],
  };
}

export function generateIntelligenceSignals(
  project: Project,
  feedback: Feedback[],
  requirementAnalyses: RequirementIntelligence[],
): IntelligenceSignal[] {
  const allRequirements = [...project.coreRequirements, ...project.addedRequirements];
  const completedCount = allRequirements.filter(r => r.status === 'completed').length;
  const implementedPercent = (completedCount / allRequirements.length) * 100;

  const negativeCount = feedback.filter(f => f.sentiment === 'negative').length;
  const featureRequests = feedback.filter(f => f.category === 'feature').length;
  const scopeAdditions = (project.scopeAlerts || []).length;

  return [
    {
      category: 'Development',
      value: Math.round(implementedPercent),
      label: 'Requirements implemented',
      insight: `${completedCount}/${allRequirements.length} requirements complete`,
    },
    {
      category: 'User Feedback',
      value: negativeCount,
      label: 'User complaints',
      trend: negativeCount > 5 ? 'up' : 'stable',
      insight: `${negativeCount} users reported issues`,
    },
    {
      category: 'Feature Demand',
      value: featureRequests,
      label: 'Feature requests',
      insight: `${featureRequests} users requested new features`,
    },
    {
      category: 'Scope',
      value: scopeAdditions,
      label: 'Scope additions detected',
      insight: `${scopeAdditions} potential out-of-scope features`,
    },
    {
      category: 'Risk',
      value: requirementAnalyses.filter(a => a.riskLevel === 'critical' || a.riskLevel === 'high').length,
      label: 'High-priority unresolved issues',
      insight: `${requirementAnalyses.filter(a => a.riskLevel === 'critical' || a.riskLevel === 'high').length} requirements at risk`,
    },
  ];
}
