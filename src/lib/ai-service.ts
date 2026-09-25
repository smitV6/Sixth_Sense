import { ProjectFormInput, Requirement, Suggestion, AddOn, Project, TimelineEvent } from './types';

export interface AIAnalysisResult {
  summary: string;
  coreRequirements: Requirement[];
  missingRequirements: Suggestion[];
  optionalAddOns: AddOn[];
  projectHealth: {
    clarity: number;
    note: string;
  };
}

export async function analyzeProjectRequirements(input: ProjectFormInput): Promise<AIAnalysisResult> {
  return new Promise(resolve => {
    setTimeout(() => {
      const coreRequirements: Requirement[] = [
        { id: '1', name: 'User registration & login', description: 'Allow users to create accounts and sign in', status: 'pending', priority: 'high' },
        { id: '2', name: 'Product catalogue', description: 'Display all available products', status: 'pending', priority: 'high' },
        { id: '3', name: 'Product search', description: 'Search and filter products by name and category', status: 'pending', priority: 'high' },
        { id: '4', name: 'Product details', description: 'View detailed product information and images', status: 'pending', priority: 'high' },
        { id: '5', name: 'Shopping cart', description: 'Add products to cart and manage quantities', status: 'pending', priority: 'high' },
        { id: '6', name: 'Checkout', description: 'Complete purchase process', status: 'pending', priority: 'high' },
        { id: '7', name: 'Online payment', description: 'Process payments securely', status: 'pending', priority: 'high' },
        { id: '8', name: 'Order tracking', description: 'Users can track their orders', status: 'pending', priority: 'high' },
      ];

      const missingRequirements: Suggestion[] = [
        {
          id: 's1',
          title: 'Payment Failure Handling',
          description: 'What happens if a payment fails? Users need to retry or choose another method.',
          priority: 'high',
          status: 'pending',
        },
        {
          id: 's2',
          title: 'Refund & Cancellation Flow',
          description: 'Users may need to cancel orders and request refunds.',
          priority: 'high',
          status: 'pending',
        },
        {
          id: 's3',
          title: 'Mobile Responsiveness',
          description: 'Ensure the shopping experience works well across screen sizes.',
          priority: 'medium',
          status: 'pending',
        },
        {
          id: 's4',
          title: 'Security & Data Protection',
          description: 'Protect user accounts and payment-related information.',
          priority: 'high',
          status: 'pending',
        },
      ];

      const optionalAddOns: AddOn[] = [
        { id: 'a1', name: 'Wishlist', description: 'Allow users to save products for later.', status: 'available' },
        { id: 'a2', name: 'Product Reviews', description: 'Allow customers to rate and review products.', status: 'available' },
        { id: 'a3', name: 'AI Product Recommendations', description: 'Recommend products based on user behaviour.', status: 'available' },
        { id: 'a4', name: 'Loyalty Program', description: 'Reward returning customers.', status: 'available' },
        { id: 'a5', name: 'Personalized Homepage', description: 'Customize product discovery based on preferences.', status: 'available' },
      ];

      resolve({
        summary:
          input.name ||
          "You're building an e-commerce platform focused on fashion discovery, purchasing and order management.",
        coreRequirements,
        missingRequirements,
        optionalAddOns,
        projectHealth: {
          clarity: 86,
          note: 'Your project is well-defined, but payment handling, cancellation and security should be clarified before development begins.',
        },
      });
    }, 100);
  });
}

export function generateProjectTimeline(): TimelineEvent[] {
  const now = Date.now();
  return [
    { id: '1', label: 'Project created', completed: true, timestamp: now },
    { id: '2', label: 'AI analysis completed', completed: true, timestamp: now + 5000 },
    { id: '3', label: 'Requirements finalized', completed: false },
    { id: '4', label: 'Developer selection pending', completed: false },
  ];
}
