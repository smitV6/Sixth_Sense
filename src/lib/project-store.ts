'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, DeveloperRequest, Requirement, AddOn } from './types';
import { generateProjectTimeline } from './ai-service';

interface ProjectStore {
  projects: Project[];
  developerRequests: DeveloperRequest[];

  createProject: (project: Project) => void;
  getProject: (id: string) => Project | undefined;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addRequirementFromSuggestion: (projectId: string, suggestionId: string) => void;
  dismissSuggestion: (projectId: string, suggestionId: string) => void;
  addOptionalAddOn: (projectId: string, addOnId: string) => void;
  finalizeProject: (projectId: string) => void;
  sendProjectToDeveloper: (projectId: string, developerId: string) => void;
  addDeveloperRequest: (request: DeveloperRequest) => void;
  getDeveloperRequests: (developerId: string) => (DeveloperRequest & { project: Project })[];
}

const SEED_PROJECT: Project = {
  id: 'stylecart-demo',
  name: 'StyleCart',
  description: 'E-commerce platform for clothing business',
  status: 'ready_for_development',
  progress: 0,
  targetUsers: 'Young adults looking for affordable fashion',
  platform: 'web',
  deadline: '2-3_months',
  coreRequirements: [
    { id: '1', name: 'User registration & login', description: 'Allow users to create accounts and sign in', status: 'pending', priority: 'high' },
    { id: '2', name: 'Product catalogue', description: 'Display all available products', status: 'pending', priority: 'high' },
    { id: '3', name: 'Product search', description: 'Search and filter products', status: 'pending', priority: 'high' },
    { id: '4', name: 'Product details', description: 'View detailed product information', status: 'pending', priority: 'high' },
    { id: '5', name: 'Shopping cart', description: 'Add products to cart', status: 'pending', priority: 'high' },
    { id: '6', name: 'Checkout', description: 'Complete purchase process', status: 'pending', priority: 'high' },
    { id: '7', name: 'Online payment', description: 'Process payments securely', status: 'pending', priority: 'high' },
    { id: '8', name: 'Order tracking', description: 'Users can track their orders', status: 'pending', priority: 'high' },
  ],
  addedRequirements: [
    { id: 's1', name: 'Payment Failure Handling', description: 'What happens if a payment fails?', status: 'pending', priority: 'high' },
    { id: 's2', name: 'Refund & Cancellation Flow', description: 'Cancel orders and request refunds', status: 'pending', priority: 'high' },
    { id: 's3', name: 'Mobile Responsiveness', description: 'Works across screen sizes', status: 'pending', priority: 'medium' },
    { id: 's4', name: 'Security & Data Protection', description: 'Protect user data and payments', status: 'pending', priority: 'high' },
  ],
  optionalAddOns: [
    { id: 'a1', name: 'Wishlist', description: 'Save products for later', status: 'available' },
    { id: 'a2', name: 'Product Reviews', description: 'Rate and review products', status: 'available' },
    { id: 'a3', name: 'AI Recommendations', description: 'Personalized product suggestions', status: 'available' },
    { id: 'a4', name: 'Loyalty Program', description: 'Reward returning customers', status: 'available' },
    { id: 'a5', name: 'Personalized Homepage', description: 'Custom product discovery', status: 'available' },
  ],
  suggestions: [],
  projectHealth: {
    clarity: 86,
    note: 'Well-defined. Clarify payment handling, cancellation and security before development.',
  },
  timeline: [
    { id: '1', label: 'Project created', completed: true },
    { id: '2', label: 'AI analysis completed', completed: true },
    { id: '3', label: 'Requirements finalized', completed: true },
    { id: '4', label: 'Developer selection pending', completed: false },
  ],
  summary: "You're building an e-commerce platform for fashion.",
  createdAt: Date.now() - 86400000,
};

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [SEED_PROJECT],
      developerRequests: [],

      createProject: project => set(state => ({ projects: [project, ...state.projects] })),

      getProject: id => {
        const project = get().projects.find(p => p.id === id);
        return project || SEED_PROJECT;
      },

      updateProject: (id, updates) =>
        set(state => ({
          projects: state.projects.map(p => (p.id === id ? { ...p, ...updates } : p)),
        })),

      addRequirementFromSuggestion: (projectId, suggestionId) => {
        const project = get().getProject(projectId);
        if (!project) return;

        const suggestion = project.suggestions.find(s => s.id === suggestionId);
        if (!suggestion) return;

        const newRequirement: Requirement = {
          id: suggestionId,
          name: suggestion.title,
          description: suggestion.description,
          status: 'pending',
          priority: suggestion.priority,
        };

        set(state => ({
          projects: state.projects.map(p =>
            p.id === projectId
              ? {
                  ...p,
                  addedRequirements: [...p.addedRequirements, newRequirement],
                  suggestions: p.suggestions.map(s =>
                    s.id === suggestionId ? { ...s, status: 'added' as const } : s,
                  ),
                }
              : p,
          ),
        }));
      },

      dismissSuggestion: (projectId, suggestionId) => {
        set(state => ({
          projects: state.projects.map(p =>
            p.id === projectId
              ? {
                  ...p,
                  suggestions: p.suggestions.map(s =>
                    s.id === suggestionId ? { ...s, status: 'dismissed' as const } : s,
                  ),
                }
              : p,
          ),
        }));
      },

      addOptionalAddOn: (projectId, addOnId) => {
        set(state => ({
          projects: state.projects.map(p =>
            p.id === projectId
              ? {
                  ...p,
                  optionalAddOns: p.optionalAddOns.map(a =>
                    a.id === addOnId ? { ...a, status: 'added' as const } : a,
                  ),
                }
              : p,
          ),
        }));
      },

      finalizeProject: projectId => {
        set(state => ({
          projects: state.projects.map(p =>
            p.id === projectId ? { ...p, status: 'ready_for_development' as const } : p,
          ),
        }));
      },

      sendProjectToDeveloper: (projectId, developerId) => {
        get().addDeveloperRequest({
          projectId,
          developerId,
          sentAt: Date.now(),
          status: 'pending',
        });

        set(state => ({
          projects: state.projects.map(p =>
            p.id === projectId
              ? { ...p, status: 'developer_review' as const, sentToDeveloperId: developerId }
              : p,
          ),
        }));
      },

      addDeveloperRequest: request => set(state => ({ developerRequests: [...state.developerRequests, request] })),

      getDeveloperRequests: developerId => {
        const requests = get().developerRequests.filter(r => r.developerId === developerId);
        return requests.map(req => ({
          ...req,
          project: get().getProject(req.projectId)!,
        }));
      },
    }),
    {
      name: 'sixth-sense-projects',
    },
  ),
);
