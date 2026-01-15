import { IconSidebar } from './IconSidebar';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { Toaster } from '@/components/ui/toaster';

export function Dashboard() {
  return (
    <>
      <div className="flex min-h-screen bg-govbr-blue-dark">
        <IconSidebar />
        <Sidebar />
        <MainContent />
      </div>
      <Toaster />
    </>
  );
}
