'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, DeveloperRequest, Requirement, Product } from './types';
import { STYLECART, CAMPUSCONNECT, FITFLOW } from './mock-project-data';
import { DEMO_PRODUCT, MOCK_FEEDBACK } from './mock-feedback-data';
import { analyzeProduct } from './feedback-service';

interface ProjectStore {
  projects: Project[];
  developerRequests: DeveloperRequest[];
  products: Product[];

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
  updateDeveloperRequest: (projectId: string, developerId: string, status: 'accepted' | 'rejected') => void;

  // Product methods
  getProduct: (id: string) => Product | undefined;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addRequirementToProduct: (productId: string, requirement: Requirement) => void;
}


const INITIAL_PROJECTS = [STYLECART, CAMPUSCONNECT, FITFLOW];

// Build the demo product with data-driven clusters/insights/health computed from mock feedback
function buildInitialProducts(): Product[] {
  const { clusters, insights, health } = analyzeProduct(MOCK_FEEDBACK);
  return [
    {
      ...DEMO_PRODUCT,
      clusters,
      insights,
      healthScore: health.score,
      requirements: [],
    },
  ];
}

const INITIAL_PRODUCTS = buildInitialProducts();

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: INITIAL_PROJECTS,
      developerRequests: [],
      products: INITIAL_PRODUCTS,

      createProject: project => set(state => ({ projects: [project, ...state.projects] })),

      getProduct: id => get().products.find(p => p.id === id),

      updateProduct: (id, updates) =>
        set(state => ({
          products: state.products.map(p => (p.id === id ? { ...p, ...updates } : p)),
        })),

      addRequirementToProduct: (productId, requirement) =>
        set(state => ({
          products: state.products.map(p =>
            p.id === productId ? { ...p, requirements: [...(p.requirements || []), requirement] } : p,
          ),
        })),

      getProject: id => {
        const project = get().projects.find(p => p.id === id);
        return project;
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

      updateDeveloperRequest: (projectId, developerId, status) => {
        set(state => ({
          developerRequests: state.developerRequests.map(req =>
            req.projectId === projectId && req.developerId === developerId
              ? { ...req, status }
              : req,
          ),
        }));

        if (status === 'accepted') {
          get().updateProject(projectId, { status: 'in_development' });
        } else if (status === 'rejected') {
          get().updateProject(projectId, { status: 'ready_for_development' });
        }
      },
    }),
    {
      name: 'sixth-sense-projects',
    },
  ),
);
