export type ProjectStatus = 'draft' | 'ready_for_development' | 'in_development' | 'completed' | 'developer_review';
export type RequirementStatus = 'pending' | 'in_progress' | 'completed';
export type PriorityLevel = 'low' | 'medium' | 'high';
export type SuggestionStatus = 'pending' | 'added' | 'dismissed';
export type Platform = 'web' | 'mobile' | 'web_mobile';
export type Deadline = '1-2_weeks' | '1_month' | '2-3_months' | '3+_months';

export interface Requirement {
  id: string;
  name: string;
  description: string;
  status: RequirementStatus;
  priority?: PriorityLevel;
  checked?: boolean;
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
