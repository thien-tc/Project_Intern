import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProjectHeader } from '@/components/layout/ProjectHeader';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { TaskCalendar } from '@/components/tasks/TaskCalendar';
import { TaskGantt } from '@/components/tasks/TaskGantt';
import { ChatPopup } from '@/components/chat/ChatPopup';
import { GroupInfoPopup } from '@/components/groups/GroupInfoPopup';
import type { Task } from '@/services/mockData';

type ViewType = 'list' | 'board' | 'calendar' | 'gantt' | 'table';

export default function Tasks() {
  const [currentView, setCurrentView] = useState<ViewType>('board');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState<{id: string, isGroup: boolean, name: string} | null>(null);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    console.log('Task clicked:', task);
  };

  const handleGroupClick = (groupId: string) => {
    setSelectedGroupId(groupId);
    setIsGroupInfoOpen(true);
  };

  const handleChatOpen = (userId?: string, isGroup?: boolean) => {
    if (userId && !isGroup) {
      // Chat with individual user
      setChatRecipient({ id: userId, isGroup: false, name: 'User Chat' });
    } else if (isGroup) {
      // Chat with group
      setChatRecipient({ id: selectedGroupId, isGroup: true, name: 'Group Chat' });
    }
    setIsChatOpen(true);
  };

  const handleChatWithGroup = () => {
    setChatRecipient({ 
      id: selectedGroupId, 
      isGroup: true, 
      name: getGroupName(selectedGroupId) 
    });
    setIsGroupInfoOpen(false);
    setIsChatOpen(true);
  };

  const handleChatWithMember = (userId: string) => {
    setChatRecipient({ 
      id: userId, 
      isGroup: false, 
      name: 'Member Chat' 
    });
    setIsGroupInfoOpen(false);
    setIsChatOpen(true);
  };

  const getGroupName = (groupId: string) => {
    const groups: Record<string, string> = {
      'dev-team': 'Development Team',
      'design-team': 'Design Team',
      'marketing-team': 'Marketing Team'
    };
    return groups[groupId] || 'Group Chat';
  };

  const renderView = () => {
    switch (currentView) {
      case 'list':
        return <TaskList onTaskClick={handleTaskClick} />;
      case 'board':
        return <TaskBoard onTaskClick={handleTaskClick} />;
      case 'calendar':
        return <TaskCalendar onTaskClick={handleTaskClick} />;
      case 'gantt':
        return <TaskGantt />;
      case 'table':
        return <TaskList onTaskClick={handleTaskClick} />;
      default:
        return <TaskBoard onTaskClick={handleTaskClick} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        onGroupClick={handleGroupClick}
        onChatOpen={handleChatOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ProjectHeader 
          currentView={currentView}
          onViewChange={setCurrentView}
          onChatOpen={() => setIsChatOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </main>
      </div>

      {/* Group Info Popup */}
      <GroupInfoPopup
        isOpen={isGroupInfoOpen}
        onClose={() => setIsGroupInfoOpen(false)}
        groupId={selectedGroupId}
        onChatWithGroup={handleChatWithGroup}
        onChatWithMember={handleChatWithMember}
      />

      {/* Chat Popup */}
      <ChatPopup 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        chatName={chatRecipient?.name || "Chat"}
      />
    </div>
  );
}