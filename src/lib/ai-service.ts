import { ProjectFormInput, Requirement, Suggestion, AddOn, TimelineEvent } from './types';

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

type ProjectDomain = 'ecommerce' | 'education' | 'healthcare' | 'finance' | 'social' | 'productivity' | 'generic';

function detectProjectDomain(input: ProjectFormInput): ProjectDomain {
  const text = `${input.name} ${input.description} ${input.targetUsers}`.toLowerCase();

  const ecommerceKeywords = ['product', 'shopping', 'cart', 'checkout', 'payment', 'order', 'store', 'buy', 'sell', 'vendor', 'customer', 'price', 'catalog', 'shop', 'purchase'];
  const educationKeywords = ['student', 'teacher', 'course', 'class', 'school', 'university', 'college', 'assignment', 'attendance', 'exam', 'grade', 'learning', 'education', 'lesson', 'faculty', 'professor'];
  const healthcareKeywords = ['patient', 'doctor', 'appointment', 'hospital', 'medicine', 'medical', 'clinic', 'prescription', 'health', 'diagnosis', 'treatment', 'nurse'];
  const financeKeywords = ['payment', 'banking', 'transaction', 'expense', 'wallet', 'investment', 'budget', 'invoice', 'financial', 'money', 'account', 'credit'];
  const socialKeywords = ['post', 'follower', 'message', 'community', 'social', 'friend', 'network', 'chat', 'comment', 'like', 'share'];
  const productivityKeywords = ['task', 'calendar', 'reminder', 'project', 'note', 'todo', 'productivity', 'organization', 'schedule', 'deadline'];

  const countMatches = (keywords: string[]) => keywords.filter(kw => text.includes(kw)).length;

  const scores = {
    ecommerce: countMatches(ecommerceKeywords),
    education: countMatches(educationKeywords),
    healthcare: countMatches(healthcareKeywords),
    finance: countMatches(financeKeywords),
    social: countMatches(socialKeywords),
    productivity: countMatches(productivityKeywords),
  };

  const maxDomain = Object.entries(scores).reduce((prev, current) =>
    current[1] > prev[1] ? current : prev,
  );

  return maxDomain[1] > 0 ? (maxDomain[0] as ProjectDomain) : 'generic';
}

function generateDomainSpecificRequirements(domain: ProjectDomain): Requirement[] {
  const requirements: Record<ProjectDomain, Requirement[]> = {
    education: [
      { id: '1', name: 'User authentication (Students & Faculty)', description: 'Secure login for students, teachers, and administrators', status: 'pending', priority: 'high' },
      { id: '2', name: 'Course and class management', description: 'Create, manage courses and organize classes', status: 'pending', priority: 'high' },
      { id: '3', name: 'Attendance tracking', description: 'Record and track student attendance', status: 'pending', priority: 'high' },
      { id: '4', name: 'Attendance dashboard', description: 'View attendance statistics and reports', status: 'pending', priority: 'high' },
      { id: '5', name: 'Student attendance percentage', description: 'Calculate and display attendance percentages', status: 'pending', priority: 'high' },
    ],
    healthcare: [
      { id: '1', name: 'Patient registration and profiles', description: 'Register and manage patient information', status: 'pending', priority: 'high' },
      { id: '2', name: 'Doctor and staff management', description: 'Manage healthcare professionals', status: 'pending', priority: 'high' },
      { id: '3', name: 'Appointment scheduling', description: 'Schedule and manage appointments', status: 'pending', priority: 'high' },
      { id: '4', name: 'Medical records', description: 'Secure storage of patient medical history', status: 'pending', priority: 'high' },
      { id: '5', name: 'Prescription management', description: 'Manage and track prescriptions', status: 'pending', priority: 'medium' },
    ],
    finance: [
      { id: '1', name: 'User accounts and authentication', description: 'Secure account creation and login', status: 'pending', priority: 'high' },
      { id: '2', name: 'Transaction processing', description: 'Handle financial transactions securely', status: 'pending', priority: 'high' },
      { id: '3', name: 'Expense tracking', description: 'Record and categorize expenses', status: 'pending', priority: 'high' },
      { id: '4', name: 'Budget management', description: 'Set and monitor budget limits', status: 'pending', priority: 'medium' },
      { id: '5', name: 'Reports and analytics', description: 'Generate financial reports and insights', status: 'pending', priority: 'medium' },
    ],
    social: [
      { id: '1', name: 'User profiles and authentication', description: 'User registration and profile management', status: 'pending', priority: 'high' },
      { id: '2', name: 'Post creation and sharing', description: 'Create, edit, and share posts', status: 'pending', priority: 'high' },
      { id: '3', name: 'Messaging system', description: 'Direct messaging between users', status: 'pending', priority: 'high' },
      { id: '4', name: 'Followers and connections', description: 'Follow users and build networks', status: 'pending', priority: 'high' },
      { id: '5', name: 'Comments and interactions', description: 'Comment, like, and react to content', status: 'pending', priority: 'medium' },
    ],
    productivity: [
      { id: '1', name: 'User authentication', description: 'Secure login and account management', status: 'pending', priority: 'high' },
      { id: '2', name: 'Task management', description: 'Create, assign, and track tasks', status: 'pending', priority: 'high' },
      { id: '3', name: 'Calendar and scheduling', description: 'Manage events and deadlines', status: 'pending', priority: 'high' },
      { id: '4', name: 'Notes and documentation', description: 'Create and organize notes', status: 'pending', priority: 'medium' },
      { id: '5', name: 'Reminders and notifications', description: 'Set reminders and receive notifications', status: 'pending', priority: 'medium' },
    ],
    ecommerce: [
      { id: '1', name: 'User registration & login', description: 'Allow users to create accounts and sign in', status: 'pending', priority: 'high' },
      { id: '2', name: 'Product catalogue', description: 'Display all available products', status: 'pending', priority: 'high' },
      { id: '3', name: 'Product search and filtering', description: 'Search and filter products by name and category', status: 'pending', priority: 'high' },
      { id: '4', name: 'Product details', description: 'View detailed product information and images', status: 'pending', priority: 'high' },
      { id: '5', name: 'Shopping cart', description: 'Add products to cart and manage quantities', status: 'pending', priority: 'high' },
      { id: '6', name: 'Checkout process', description: 'Complete purchase process', status: 'pending', priority: 'high' },
      { id: '7', name: 'Online payment', description: 'Process payments securely', status: 'pending', priority: 'high' },
      { id: '8', name: 'Order tracking', description: 'Users can track their orders', status: 'pending', priority: 'high' },
    ],
    generic: [
      { id: '1', name: 'User authentication', description: 'Secure login and user management', status: 'pending', priority: 'high' },
      { id: '2', name: 'Core functionality', description: 'Primary features based on your description', status: 'pending', priority: 'high' },
      { id: '3', name: 'User interface', description: 'Intuitive and user-friendly interface', status: 'pending', priority: 'high' },
      { id: '4', name: 'Data persistence', description: 'Save and retrieve user data reliably', status: 'pending', priority: 'high' },
    ],
  };

  return requirements[domain];
}

function generateDomainSpecificSuggestions(domain: ProjectDomain): Suggestion[] {
  const suggestions: Record<ProjectDomain, Suggestion[]> = {
    education: [
      { id: 's1', title: 'Role-based access control', description: 'Different permissions for students, teachers, and admin', priority: 'high', status: 'pending' },
      { id: 's2', title: 'Attendance correction workflow', description: 'Allow students to request corrections with teacher approval', priority: 'medium', status: 'pending' },
      { id: 's3', title: 'Low attendance alerts', description: 'Notify students when attendance falls below threshold', priority: 'medium', status: 'pending' },
      { id: 's4', title: 'Data privacy and compliance', description: 'Ensure FERPA/educational data privacy compliance', priority: 'high', status: 'pending' },
    ],
    healthcare: [
      { id: 's1', title: 'Data privacy and security (HIPAA)', description: 'Ensure patient data protection compliance', priority: 'high', status: 'pending' },
      { id: 's2', title: 'Appointment reminders', description: 'Send reminders to patients before appointments', priority: 'medium', status: 'pending' },
      { id: 's3', title: 'Telemedicine integration', description: 'Support virtual consultations', priority: 'medium', status: 'pending' },
      { id: 's4', title: 'Insurance management', description: 'Integration with insurance providers', priority: 'medium', status: 'pending' },
    ],
    finance: [
      { id: 's1', title: 'Two-factor authentication', description: 'Enhanced security for financial accounts', priority: 'high', status: 'pending' },
      { id: 's2', title: 'Transaction history and exports', description: 'Detailed records and CSV exports', priority: 'medium', status: 'pending' },
      { id: 's3', title: 'Recurring transactions', description: 'Set up automated recurring payments', priority: 'medium', status: 'pending' },
      { id: 's4', title: 'Multi-currency support', description: 'Support for international transactions', priority: 'low', status: 'pending' },
    ],
    social: [
      { id: 's1', title: 'Content moderation', description: 'Tools for moderating and managing content', priority: 'high', status: 'pending' },
      { id: 's2', title: 'User search and discovery', description: 'Help users find and discover new accounts', priority: 'medium', status: 'pending' },
      { id: 's3', title: 'Privacy controls', description: 'Granular privacy settings for posts and profiles', priority: 'high', status: 'pending' },
      { id: 's4', title: 'Hashtags and trending', description: 'Track trending topics and hashtags', priority: 'medium', status: 'pending' },
    ],
    productivity: [
      { id: 's1', title: 'Project templates', description: 'Pre-built templates for common project types', priority: 'medium', status: 'pending' },
      { id: 's2', title: 'Team collaboration', description: 'Assign tasks and collaborate with team members', priority: 'high', status: 'pending' },
      { id: 's3', title: 'File attachments', description: 'Attach files to tasks and notes', priority: 'medium', status: 'pending' },
      { id: 's4', title: 'Time tracking', description: 'Track time spent on tasks', priority: 'low', status: 'pending' },
    ],
    ecommerce: [
      { id: 's1', title: 'Payment failure handling', description: 'Graceful handling of payment failures with retry options', priority: 'high', status: 'pending' },
      { id: 's2', title: 'Refund and cancellation flow', description: 'Allow users to cancel orders and request refunds', priority: 'high', status: 'pending' },
      { id: 's3', title: 'Inventory management', description: 'Track and manage product stock levels', priority: 'high', status: 'pending' },
      { id: 's4', title: 'Security and data protection', description: 'Protect user accounts and payment information', priority: 'high', status: 'pending' },
    ],
    generic: [
      { id: 's1', title: 'Error handling and logging', description: 'Comprehensive error handling and system logging', priority: 'high', status: 'pending' },
      { id: 's2', title: 'User support and documentation', description: 'Help section and user documentation', priority: 'medium', status: 'pending' },
      { id: 's3', title: 'Mobile responsiveness', description: 'Ensure application works on all devices', priority: 'medium', status: 'pending' },
      { id: 's4', title: 'Performance optimization', description: 'Optimize for speed and responsiveness', priority: 'medium', status: 'pending' },
    ],
  };

  return suggestions[domain];
}

function generateDomainSpecificAddOns(domain: ProjectDomain): AddOn[] {
  const addOns: Record<ProjectDomain, AddOn[]> = {
    education: [
      { id: 'a1', name: 'Attendance analytics dashboard', description: 'Advanced analytics and visualizations of attendance patterns', status: 'available' },
      { id: 'a2', name: 'Parent notifications', description: 'Notify parents of student attendance status', status: 'available' },
      { id: 'a3', name: 'QR code attendance', description: 'Quick attendance marking via QR codes', status: 'available' },
      { id: 'a4', name: 'Performance insights', description: 'Correlate attendance with academic performance', status: 'available' },
    ],
    healthcare: [
      { id: 'a1', name: 'Appointment analytics', description: 'Track no-shows and appointment patterns', status: 'available' },
      { id: 'a2', name: 'Patient feedback system', description: 'Collect feedback and ratings from patients', status: 'available' },
      { id: 'a3', name: 'Billing integration', description: 'Automate billing and insurance claims', status: 'available' },
      { id: 'a4', name: 'Lab results integration', description: 'Display and track lab test results', status: 'available' },
    ],
    finance: [
      { id: 'a1', name: 'Investment tracking', description: 'Monitor investment portfolio performance', status: 'available' },
      { id: 'a2', name: 'Savings goals', description: 'Set and track savings goals', status: 'available' },
      { id: 'a3', name: 'Bill reminders', description: 'Reminders for upcoming bills and payments', status: 'available' },
      { id: 'a4', name: 'Tax reporting tools', description: 'Prepare documents for tax filing', status: 'available' },
    ],
    social: [
      { id: 'a1', name: 'AI content recommendations', description: 'Personalized content feed based on interests', status: 'available' },
      { id: 'a2', name: 'User verification badges', description: 'Badge system for verified accounts', status: 'available' },
      { id: 'a3', name: 'Live streaming', description: 'Enable live video streaming for users', status: 'available' },
      { id: 'a4', name: 'Story feature', description: 'Time-limited story posts like Instagram/Snapchat', status: 'available' },
    ],
    productivity: [
      { id: 'a1', name: 'Team collaboration tools', description: 'Share projects and collaborate with team members', status: 'available' },
      { id: 'a2', name: 'AI task suggestions', description: 'Get smart task recommendations', status: 'available' },
      { id: 'a3', name: 'Email integration', description: 'Turn emails into tasks automatically', status: 'available' },
      { id: 'a4', name: 'Calendar sync', description: 'Sync with Google Calendar and Outlook', status: 'available' },
    ],
    ecommerce: [
      { id: 'a1', name: 'Wishlist', description: 'Allow users to save products for later', status: 'available' },
      { id: 'a2', name: 'Product reviews and ratings', description: 'Allow customers to rate and review products', status: 'available' },
      { id: 'a3', name: 'AI product recommendations', description: 'Recommend products based on user behavior', status: 'available' },
      { id: 'a4', name: 'Loyalty program', description: 'Reward returning customers', status: 'available' },
      { id: 'a5', name: 'Personalized homepage', description: 'Customize product discovery based on preferences', status: 'available' },
    ],
    generic: [
      { id: 'a1', name: 'Analytics dashboard', description: 'Track usage and performance metrics', status: 'available' },
      { id: 'a2', name: 'Export functionality', description: 'Export data in various formats', status: 'available' },
      { id: 'a3', name: 'API access', description: 'Third-party API integration for developers', status: 'available' },
      { id: 'a4', name: 'Advanced notifications', description: 'Customizable alerts and notifications', status: 'available' },
    ],
  };

  return addOns[domain];
}

function calculateProjectHealth(input: ProjectFormInput): { clarity: number; note: string } {
  let clarity = 50;
  const factors: string[] = [];

  if (input.description && input.description.length > 100) {
    clarity += 15;
    factors.push('Detailed description provided');
  }
  if (input.name && input.name.length > 0) {
    clarity += 10;
    factors.push('Project name defined');
  }
  if (input.targetUsers && input.targetUsers.length > 0) {
    clarity += 15;
    factors.push('Target users identified');
  }
  if (input.platform && input.platform.length > 0) {
    clarity += 10;
    factors.push('Platform specified');
  }
  if (input.deadline && input.deadline.length > 0) {
    clarity += 10;
    factors.push('Deadline set');
  }

  clarity = Math.min(clarity, 95);

  const note = factors.length > 0
    ? `Your project is well-defined. ${factors.slice(0, 2).join('. ')}.`
    : 'Please provide more details about your project to improve clarity.';

  return { clarity, note };
}

export async function analyzeProjectRequirements(input: ProjectFormInput): Promise<AIAnalysisResult> {
  return new Promise(resolve => {
    setTimeout(() => {
      const domain = detectProjectDomain(input);
      const coreRequirements = generateDomainSpecificRequirements(domain);
      const missingRequirements = generateDomainSpecificSuggestions(domain);
      const optionalAddOns = generateDomainSpecificAddOns(domain);
      const projectHealth = calculateProjectHealth(input);

      const summary = input.name
        ? `You're building ${input.name}: ${input.description?.substring(0, 100) || 'your project'}...`
        : input.description || 'Your project';

      resolve({
        summary,
        coreRequirements,
        missingRequirements,
        optionalAddOns,
        projectHealth,
      });
    }, 1500);
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
