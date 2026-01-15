import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { Toaster } from '@/components/ui/toaster';

export function Dashboard() {
  return (
    <>
      <div className="flex min-h-screen bg-[#2a2a2a]">
        <Sidebar />
        <MainContent />
      </div>
      <Toaster />
    </>
  );
}
