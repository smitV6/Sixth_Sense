export const mockData = {
  client: {
    name: 'Sarah Mehta',
    email: 'sarah@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    stats: {
      activeProjects: 2,
      completed: 4,
      aiSuggestions: 7,
      developers: 3,
    },
    projects: [
      {
        id: '1',
        name: 'StyleCart',
        description: 'E-commerce platform',
        progress: 72,
        status: 'in_progress',
      },
      {
        id: '2',
        name: 'CampusConnect',
        description: 'Student collaboration platform',
        progress: 45,
        status: 'in_progress',
      },
    ],
    insights: [
      {
        id: '1',
        title: '3 requirements may need attention',
        description: 'Review project scopes to ensure alignment',
        type: 'warning',
      },
      {
        id: '2',
        title: '5 AI suggestions available',
        description: 'New feature recommendations from user feedback',
        type: 'info',
      },
      {
        id: '3',
        title: '1 project approaching deadline',
        description: 'CampusConnect milestone in 5 days',
        type: 'urgent',
      },
    ],
  },

  developer: {
    name: 'Alex Sharma',
    email: 'alex@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    stats: {
      activeProjects: 6,
      pendingRequirements: 18,
      githubActivity: 12,
      userFeedback: 2431,
    },
    projects: [
      { id: '1', name: 'StyleCart', progress: 72 },
      { id: '2', name: 'CampusConnect', progress: 45 },
      { id: '3', name: 'FitFlow', progress: 88 },
    ],
    insights: [
      {
        id: '1',
        severity: 'critical',
        title: '187 users reported authentication problems',
        projectId: '1',
      },
      {
        id: '2',
        severity: 'high',
        title: 'Payment failure handling is missing from project requirement',
        projectId: '1',
      },
      {
        id: '3',
        severity: 'medium',
        title: '312 users requested dark mode',
        projectId: '3',
      },
    ],
  },
};
