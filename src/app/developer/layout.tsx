'use client';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { useProjectStore } from '@/lib/project-store';
import { MOCK_DEVELOPERS } from '@/lib/mock-developers';

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  const currentDeveloperId = useProjectStore(state => state.currentDeveloperId);
  const currentDeveloper = MOCK_DEVELOPERS.find(d => d.id === currentDeveloperId) || MOCK_DEVELOPERS[0];

  return (
    <DashboardShell userRole="developer" userName={currentDeveloper.name}>
      {children}
    </DashboardShell>
  );
}
