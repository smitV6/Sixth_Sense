import { DashboardShell } from '@/components/dashboard/dashboard-shell';

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell userRole="developer" userName="Alex Sharma">{children}</DashboardShell>;
}
