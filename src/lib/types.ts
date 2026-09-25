export type ProjectStatus = 'draft' | 'ready_for_development' | 'in_development' | 'completed' | 'developer_review';
export type RequirementStatus = 'pending' | 'in_progress' | 'completed';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';
export type SuggestionStatus = 'pending' | 'added' | 'dismissed';
export type Platform = 'web' | 'mobile' | 'web_mobile';
export type Deadline = '1-2_weeks' | '1_month' | '2-3_months' | '3+_months';
export type ScopeAlertType = 'feature_addition' | 'scope_addition' | 'scope_creep' | 'requirement_mismatch' | 'risk_detected';
export type ScopeAlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ActivityEventType = 'commit' | 'requirement_update' | 'scope_alert' | 'pr_created' | 'review' | 'deployment';

// Phase 4: Feedback & Product Types
export type FeedbackSentiment = 'positive' | 'neutral' | 'negative';
export type FeedbackSource = 'in_app' | 'support' | 'review' | 'survey' | 'social' | 'interview';
export type FeedbackCategory = 'bug' | 'feature' | 'ux' | 'performance' | 'positive' | 'other';
export type FeedbackAIClassification = 'bug' | 'feature' | 'ux' | 'performance' | 'positive' | 'other';
export type FeedbackStatus = 'new' | 'reviewing' | 'planned' | 'in_progress' | 'resolved' | 'dismissed';
export type TrendDirection = 'increasing' | 'stable' | 'decreasing';

export interface Requirement {
  id: string;
  name: string;
  description: string;
  status: RequirementStatus;
  priority?: PriorityLevel;
  checked?: boolean;
  estimatedEffort?: 'small' | 'medium' | 'large';
  completedAt?: number;
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  status: SuggestionStatus;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'added';
}

export interface GitCommit {
  id: string;
  message: string;
  developer: string;
  timestamp: number;
  filesChanged: number;
  linesAdded: number;
  linesRemoved: number;
  relatedRequirementId?: string;
  aiClassification?: 'core_feature' | 'bug_fix' | 'refactor' | 'scope_addition' | 'unrelated';
  confidence?: number;
}

export interface ScopeAlert {
  id: string;
  type: ScopeAlertType;
  severity: ScopeAlertSeverity;
  feature: string;
  relatedCommitId?: string;
  description: string;
  recommendation: string;
  createdAt: number;
  status?: 'open' | 'approved' | 'rejected' | 'resolved';
}

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  label: string;
  timestamp: number;
  details?: {
    commitId?: string;
    requirementId?: string;
    author?: string;
    description?: string;
  };
}

export interface ProjectHealth {
  score: number; // 0-100
  reasons: string[];
  lastUpdated: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  targetUsers?: string;
  platform?: Platform;
  deadline?: Deadline;
  coreRequirements: Requirement[];
  addedRequirements: Requirement[];
  optionalAddOns: AddOn[];
  suggestions: Suggestion[];
  projectHealth: {
    clarity: number;
    note: string;
  };
  timeline: TimelineEvent[];
  summary?: string;
  createdAt: number;
  sentToDeveloperId?: string;
  gitRepository?: string;
  commits?: GitCommit[];
  scopeAlerts?: ScopeAlert[];
  activities?: ActivityEvent[];
  developmentHealth?: ProjectHealth;
}

export interface TimelineEvent {
  id: string;
  label: string;
  completed: boolean;
  timestamp?: number;
}

export interface Developer {
  id: string;
  name: string;
  title: string;
  skills: string[];
  projects: number;
  availability: 'available' | 'busy';
  busyUntil?: string;
  avatar: string;
}

export interface DeveloperRequest {
  developerId: string;
  projectId: string;
  sentAt: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ProjectFormInput {
  description: string;
  name?: string;
  targetUsers?: string;
  platform?: Platform;
  deadline?: Deadline;
}

// Phase 4: Feedback Interface
export interface Feedback {
  id: string;
  text: string;
  userId: string;
  userName: string;
  date: number;
  source: FeedbackSource;
  sentiment: FeedbackSentiment;
  category: FeedbackCategory;
  aiClassification: FeedbackAIClassification;
  priority: PriorityLevel;
  status: FeedbackStatus;
  clusterId?: string;
}

// Phase 4: Feedback Cluster Interface
export interface SentimentDistribution {
  positive: number;
  neutral: number;
  negative: number;
}

export interface FeedbackCluster {
  id: string;
  title: string;
  feedbackIds: string[];
  sentimentDistribution: SentimentDistribution;
  impactLevel: PriorityLevel; // critical/high/medium/low
  trend: TrendDirection;
  aiSummary: string;
  exampleFeedback: Feedback[];
  createdAt: number;
}

// Phase 4: Product Insight Interface
export interface ProductInsight {
  id: string;
  title: string;
  evidence: string;
  impact: string;
  trend: TrendDirection;
  suggestedAction: string;
  clusterId?: string;
}

// Phase 4: Product Interface
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  totalUsers: number;
  activeUsers: number;
  metrics: {
    crashRate: number;
    avgResponseTime: number;
    errorRate: number;
    satisfactionScore: number;
  };
  healthScore: number; // 0-100
  clusters: FeedbackCluster[];
  insights: ProductInsight[];
  requirements: Requirement[];
  createdAt: number;
}
