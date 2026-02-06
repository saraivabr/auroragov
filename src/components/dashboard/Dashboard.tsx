import { IconSidebar } from './IconSidebar';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';

export function Dashboard() {
  return (
    <>
      <div className="flex min-h-screen bg-govbr-blue-dark">
        <IconSidebar />
        <Sidebar />
        <MainContent />
      </div>
    </>
  );
}
