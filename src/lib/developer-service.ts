import { GitCommit, ScopeAlert, Requirement, Project, ProjectHealth } from './types';

export interface CommitAnalysisResult {
  matchedRequirementId?: string;
  confidence: number;
  classification: GitCommit['aiClassification'];
  reasoning: string;
}

export function analyzeCommitToRequirement(
  commit: GitCommit,
  requirements: Requirement[],
): CommitAnalysisResult {
  const commitMessage = commit.message.toLowerCase();
  const keywords = commitMessage.split(/[:\s\-\/]+/);

  // If already classified by mock data, use that
  if (commit.aiClassification && commit.relatedRequirementId) {
    return {
      matchedRequirementId: commit.relatedRequirementId,
      confidence: commit.confidence || 0.85,
      classification: commit.aiClassification,
      reasoning: `Based on commit message analysis and git history patterns.`,
    };
  }

  // Feature detection
  const featureKeywords = ['feat', 'feature', 'add', 'implement', 'create', 'new'];
  const bugFixKeywords = ['fix', 'bug', 'issue', 'resolve', 'patch', 'hotfix'];
  const refactorKeywords = ['refactor', 'refactoring', 'cleanup', 'organize', 'restructure'];

  const isBugFix = bugFixKeywords.some(kw => keywords.includes(kw));
  const isRefactor = refactorKeywords.some(kw => keywords.includes(kw));
  const isFeature = featureKeywords.some(kw => keywords.includes(kw)) && !isBugFix && !isRefactor;

  let classification: GitCommit['aiClassification'] = 'unrelated';
  if (isBugFix) classification = 'bug_fix';
  else if (isRefactor) classification = 'refactor';
  else if (isFeature) classification = 'core_feature';

  // Try to match to requirements
  let matchedRequirementId: string | undefined;
  let maxSimilarity = 0;

  for (const requirement of requirements) {
    const reqName = requirement.name.toLowerCase();
    const reqDesc = requirement.description.toLowerCase();

    // Count keyword matches
    let matches = 0;
    for (const keyword of keywords) {
      if (keyword.length > 2) {
        if (reqName.includes(keyword) || reqDesc.includes(keyword)) {
          matches++;
        }
      }
    }

    const similarity = matches / Math.max(keywords.length, 1);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      matchedRequirementId = similarity > 0.3 ? requirement.id : undefined;
    }
  }

  // Scope addition detection
  if (isFeature && !matchedRequirementId && maxSimilarity < 0.3) {
    classification = 'scope_addition';
  }

  const confidence = matchedRequirementId
    ? Math.min(0.95, 0.6 + maxSimilarity * 0.35)
    : Math.max(0.5, maxSimilarity * 0.7);

  return {
    matchedRequirementId,
    confidence,
    classification,
    reasoning: `Analyzed commit message for keywords and patterns. ${
      matchedRequirementId ? `Matched to requirement "${requirements.find(r => r.id === matchedRequirementId)?.name}".` : 'No matching requirement found.'
    }`,
  };
}

export function detectScopeAdditions(commits: GitCommit[], requirements: Requirement[]): ScopeAlert[] {
  const scopeAdditions = commits
    .filter(commit => {
      const analysis = analyzeCommitToRequirement(commit, requirements);
      return analysis.classification === 'scope_addition';
    })
    .map(commit => {
      const featureName = extractFeatureName(commit.message);
      return {
        id: `alert-scope-${commit.id}`,
        type: 'scope_addition' as const,
        severity: 'medium' as const,
        feature: featureName,
        relatedCommitId: commit.id,
        description: `New feature "${featureName}" detected in commits. This was not in the original requirements.`,
        recommendation: 'Review this feature with the client to determine if it should be added to scope or documented as an enhancement.',
        createdAt: commit.timestamp,
        status: 'open' as const,
      };
    });

  return scopeAdditions;
}

export function calculateProjectHealth(project: Project): ProjectHealth {
  const requirements = [...project.coreRequirements, ...project.addedRequirements];
  const commits = project.commits || [];

  const reasons: string[] = [];
  let score = 50; // Base score

  // 1. Requirement completion rate
  const completedRequirements = requirements.filter(r => r.status === 'completed').length;
  const completionRate = requirements.length > 0 ? completedRequirements / requirements.length : 0;
  score += completionRate * 30; // Up to 30 points for completion
  if (completionRate >= 0.8) reasons.push('Strong progress on requirements');
  else if (completionRate < 0.3) reasons.push('Early stage development');

  // 2. Commit frequency and consistency
  if (commits.length > 0) {
    const avgCommitsPerDay = commits.length / 30; // Assume 30-day development window
    if (avgCommitsPerDay > 0.5) {
      score += 10;
      reasons.push('Good commit frequency');
    } else if (avgCommitsPerDay < 0.2) {
      score -= 5;
      reasons.push('Low commit frequency');
    }
  }

  // 3. Bug fix vs feature ratio
  const bugFixes = commits.filter(c => c.aiClassification === 'bug_fix').length;
  const features = commits.filter(c => c.aiClassification === 'core_feature').length;
  const bugFixRatio = features > 0 ? bugFixes / (features + bugFixes) : 0;

  if (bugFixRatio > 0.15) {
    score += 5;
    reasons.push('Good attention to bug fixes');
  }

  // 4. Scope creep detection
  const scopeAdditions = commits.filter(c => c.aiClassification === 'scope_addition').length;
  if (scopeAdditions === 0) {
    score += 5;
    reasons.push('Well-controlled scope');
  } else if (scopeAdditions > commits.length * 0.2) {
    score -= 10;
    reasons.push('Significant scope additions detected');
  }

  // 5. Code quality signals
  const averageLinesAdded = commits.length > 0 ? commits.reduce((sum, c) => sum + c.linesAdded, 0) / commits.length : 0;
  const averageLinesRemoved = commits.length > 0 ? commits.reduce((sum, c) => sum + c.linesRemoved, 0) / commits.length : 0;

  // Refactoring is good (more lines removed)
  if (averageLinesRemoved > averageLinesAdded * 0.3) {
    score += 5;
    reasons.push('Good code refactoring practices');
  }

  // 6. Confidence in AI classification
  const avgConfidence = commits.length > 0
    ? commits.reduce((sum, c) => sum + (c.confidence || 0.85), 0) / commits.length
    : 0.85;

  if (avgConfidence > 0.9) {
    score += 5;
    reasons.push('Clear development intent and classification');
  }

  // 7. Project deadline proximity
  if (project.deadline) {
    const urgencyMap = {
      '1-2_weeks': 0.95,
      '1_month': 0.8,
      '2-3_months': 0.6,
      '3+_months': 0.4,
    };
    const urgency = urgencyMap[project.deadline];

    if (completionRate < urgency) {
      score -= 10;
      reasons.push('Behind schedule for deadline');
    } else if (completionRate > urgency + 0.2) {
      score += 5;
      reasons.push('Ahead of schedule');
    }
  }

  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, Math.round(score)));

  if (reasons.length === 0) {
    reasons.push('Project developing as expected');
  }

  return {
    score,
    reasons,
    lastUpdated: Date.now(),
  };
}

function extractFeatureName(commitMessage: string): string {
  // Extract feature name from commit message
  // e.g., "feat: dark mode styling" -> "Dark Mode"
  const match = commitMessage.match(/(?:feat|feature|add|implement):\s*(.+?)(?:\s*-|\s*$)/i);
  if (match && match[1]) {
    return match[1]
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .slice(0, 50); // Limit to 50 chars
  }

  // Fallback: take first few words
  const words = commitMessage.replace(/^(feat|feature|add|implement):/i, '').trim().split(/[\s\-:]/);
  return words
    .slice(0, 3)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getRequirementCommitMapping(
  requirements: Requirement[],
  commits: GitCommit[],
): Record<string, { commits: GitCommit[]; matchedCount: number; completionStatus: string }> {
  const mapping: Record<string, { commits: GitCommit[]; matchedCount: number; completionStatus: string }> = {};

  for (const requirement of requirements) {
    const matchedCommits = commits.filter(commit => commit.relatedRequirementId === requirement.id);
    mapping[requirement.id] = {
      commits: matchedCommits,
      matchedCount: matchedCommits.length,
      completionStatus: requirement.status,
    };
  }

  return mapping;
}

export function getUnmatchedCommits(commits: GitCommit[], requirements: Requirement[]): GitCommit[] {
  return commits.filter(commit => {
    if (commit.relatedRequirementId) return false;
    const analysis = analyzeCommitToRequirement(commit, requirements);
    return !analysis.matchedRequirementId;
  });
}
