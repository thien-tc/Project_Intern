import { useState } from 'react';
import { 
  Home, 
  Target, 
  Clock, 
  BarChart3, 
  FileText, 
  Plus,
  ChevronRight,
  Search,
  MessageCircle,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/common/UserAvatar';
import { CreateGroupDialog } from '@/components/groups/CreateGroupDialog';
import { useApp } from '@/context/AppContext';
import { Link, useLocation } from 'react-router-dom';

interface Group {
  id: string;
  name: string;
  description: string;
  color: string;
  privacy: 'public' | 'private';
  inviteEmails: string[];
  memberCount: number;
  members: string[];
  createdAt: string;
}

interface SidebarProps {
  onGroupClick?: (groupId: string) => void;
  onChatOpen?: (userId?: string, isGroup?: boolean) => void;
}

export function Sidebar({ onGroupClick, onChatOpen }: SidebarProps) {
  const { state } = useApp();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(['spaces']);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/', active: location.pathname === '/' },
    { icon: MessageCircle, label: 'Chat', path: '/chat', active: location.pathname === '/chat' },
    { 
      icon: Bell, 
      label: 'Notifications', 
      path: '/notifications', 
      badge: 3,
      active: location.pathname === '/notifications'
    },
    { icon: Target, label: 'Goals', path: '/goals' },
    { icon: Clock, label: 'Time Tracking', path: '/time-tracking', active: location.pathname === '/time-tracking' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', active: location.pathname === '/analytics' },
    { icon: FileText, label: 'Reports', path: '/reports' },
  ];

  const groups = [
    { 
      id: 'dev-team', 
      name: 'Development Team', 
      memberCount: 5,
      members: ['1', '2'],
      description: 'Frontend & Backend developers working on core features'
    },
    { 
      id: 'design-team', 
      name: 'Design Team', 
      memberCount: 3,
      members: ['3'],
      description: 'UI/UX designers creating amazing user experiences'
    },
    { 
      id: 'marketing-team', 
      name: 'Marketing Team', 
      memberCount: 2,
      members: ['1'],
      description: 'Marketing specialists driving growth and engagement'
    }
  ];

  const handleGroupCreated = (newGroup: Group) => {
    console.log('New group created:', newGroup);
    // Here you would typically dispatch an action to add the group to state
  };

  return (
    <>
      <div className="w-64 h-screen bg-background border-r border-border flex flex-col">
        {/* Workspace Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-semibold">
              M
            </div>
            <div>
              <h2 className="font-semibold text-sm">My Workspace</h2>
              <p className="text-xs text-muted-foreground">{state.users.length} members</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search spaces, lists..." 
              className="pl-9 h-8 text-sm"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-2">
            {navItems.map((item) => (
              <div key={item.path}>
                
                  <Link to={item.path}>
                    <Button
                      variant={item.active ? "secondary" : "ghost"}
                      className="w-full justify-start mb-1 h-8"
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      <span className="text-sm">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto h-5 px-2 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>

              </div>
            ))}
          </nav>

          {/* Groups */}
          <div className="px-2 py-2">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Groups
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => setIsCreateGroupOpen(true)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            {groups.map((group) => (
              <Button 
                key={group.id}
                variant="ghost" 
                className="w-full justify-start h-8 text-sm"
                onClick={() => onGroupClick?.(group.id)}
              >
                <MessageCircle className="mr-2 h-3 w-3" />
                {group.name}
                <Badge variant="secondary" className="ml-auto h-4 px-1 text-xs">
                  {group.memberCount}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Spaces */}
          <div className="px-2 py-2">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Spaces
              </span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            {state.projects.map((project) => (
              <div key={project.id}>
                <Link to="/tasks">
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-8 text-sm"
                    onClick={() => toggleSection(`project-${project.id}`)}
                  >
                    <ChevronRight 
                      className={`mr-2 h-3 w-3 transition-transform ${
                        expandedSections.includes(`project-${project.id}`) ? 'rotate-90' : ''
                      }`} 
                    />
                    <div 
                      className="w-2 h-2 rounded-full mr-2" 
                      style={{ backgroundColor: project.color }}
                    />
                    {project.name}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Team Members */}
          <div className="px-2 py-2">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Team Members
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => onChatOpen?.()}
              >
                <MessageCircle className="h-3 w-3" />
              </Button>
            </div>
            
            {state.users.filter(user => user.id !== state.currentUser.id).map((user) => (
              <Button
                key={user.id}
                variant="ghost"
                className="w-full justify-start h-8 text-sm"
                onClick={() => onChatOpen?.(user.id, false)}
              >
                <UserAvatar user={user} size="sm" />
                <span className="ml-2 truncate">{user.name}</span>
                <div className="ml-auto w-2 h-2 bg-green-500 rounded-full" />
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Create Group Dialog */}
      <CreateGroupDialog
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        onGroupCreated={handleGroupCreated}
      />
    </>
  );
}