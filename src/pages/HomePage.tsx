import { RealDashboard } from '@/components/dashboard/RealDashboard';
import { IconSidebar } from '@/components/dashboard/IconSidebar';
import { Sidebar } from '@/components/dashboard/Sidebar';

export function HomePage() {
  return (
    <>
      <div className="flex min-h-screen bg-white">
        <IconSidebar />
        <Sidebar />
        <RealDashboard />
      </div>
    </>
  );
}
