import { Developer } from './types';

export const MOCK_DEVELOPERS: Developer[] = [
  {
    id: '1',
    name: 'Alex Sharma',
    title: 'Full-stack Developer',
    skills: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
    projects: 28,
    availability: 'available',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
  {
    id: '2',
    name: 'Priya Shah',
    title: 'Frontend & Mobile Developer',
    skills: ['React', 'Flutter', 'Firebase'],
    projects: 19,
    availability: 'available',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
  },
  {
    id: '3',
    name: 'Rahul Mehta',
    title: 'Backend & AI Developer',
    skills: ['Python', 'FastAPI', 'Node.js', 'PostgreSQL', 'AI/ML'],
    projects: 34,
    availability: 'busy',
    busyUntil: 'next week',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
  },
];
