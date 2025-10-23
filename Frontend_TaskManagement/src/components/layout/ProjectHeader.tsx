import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  List, 
  LayoutGrid, 
  Calendar, 
  BarChart3, 
  Table, 
  Filter,
  Search,
  MessageCircle,
  Star,
  Share,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';

type ViewType = 'list' | 'board' | 'calendar' | 'gantt' | 'table';

interface ProjectHeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onChatOpen: () => void;
}

export function ProjectHeader({ currentView, onViewChange, onChatOpen }: ProjectHeaderProps) {
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const views = [
    { key: 'list' as const, label: 'List', icon: List },
    { key: 'board' as const, label: 'Board', icon: LayoutGrid },
    { key: 'calendar' as const, label: 'Calendar', icon: Calendar },
    { key: 'gantt' as const, label: 'Gantt', icon: BarChart3 },
    { key: 'table' as const, label: 'Table', icon: Table },
  ];

  const currentProject = state.projects[0];

  return (
    <div className="border-b border-border bg-background">
      {/* Project Info */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: currentProject?.color || '#3b82f6' }}
              />
              <h1 className="text-xl font-semibold">
                {currentProject?.name || 'Project 1'}
              </h1>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Star className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Views and Controls */}
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* View Tabs */}
          <div className="flex items-center gap-1">
            {views.map(view => (
              <Button
                key={view.key}
                variant={currentView === view.key ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange(view.key)}
                className="gap-2"
              >
                <view.icon className="h-4 w-4" />
                {view.label}
              </Button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Group: Status</span>
              <span>Subtasks</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Sort
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Closed
              </Button>
              <Button variant="outline" size="sm">
                Assignee
              </Button>
              <Button variant="outline" size="sm">
                <Search className="mr-2 h-4 w-4" />
                Customize
              </Button>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Task
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}