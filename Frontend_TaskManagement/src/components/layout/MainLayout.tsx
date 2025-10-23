import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ChatToggle } from '@/components/chat/ChatToggle';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showNewTaskButton?: boolean;
  onNewTask?: () => void;
}

export function MainLayout({ 
  children, 
  title, 
  subtitle, 
  showNewTaskButton, 
  onNewTask 
}: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={title} 
          subtitle={subtitle}
          showNewTaskButton={showNewTaskButton}
          onNewTask={onNewTask}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <ChatToggle />
    </div>
  );
}