import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Users, Settings, X, UserPlus, MoreHorizontal } from 'lucide-react';
import { UserAvatar } from '@/components/common/UserAvatar';
import { InviteMemberDialog } from './InviteMemberDialog';
import { useApp } from '@/context/AppContext';

interface GroupInfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  onChatWithGroup: () => void;
  onChatWithMember: (userId: string) => void;
}

export function GroupInfoPopup({ 
  isOpen, 
  onClose, 
  groupId, 
  onChatWithGroup, 
  onChatWithMember 
}: GroupInfoPopupProps) {
  const { state } = useApp();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const groups = {
    'dev-team': { 
      id: 'dev-team', 
      name: 'Development Team', 
      memberCount: 5,
      members: ['1', '2'],
      description: 'Frontend & Backend developers working on core features',
      color: '#3b82f6'
    },
    'design-team': { 
      id: 'design-team', 
      name: 'Design Team', 
      memberCount: 3,
      members: ['3'],
      description: 'UI/UX designers creating amazing user experiences',
      color: '#10b981'
    },
    'marketing-team': { 
      id: 'marketing-team', 
      name: 'Marketing Team', 
      memberCount: 2,
      members: ['1'],
      description: 'Marketing specialists driving growth and engagement',
      color: '#f59e0b'
    }
  };

  const group = groups[groupId as keyof typeof groups];
  if (!group) return null;

  const groupMembers = group.members.map(id => 
    state.users.find(user => user.id === id)
  ).filter(Boolean);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: group.color }}
                >
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-lg">{group.name}</DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    {group.memberCount} members
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">About</h4>
              <p className="text-sm text-muted-foreground">{group.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                className="flex-1 gap-2" 
                onClick={onChatWithGroup}
              >
                <MessageCircle className="h-4 w-4" />
                Chat with Group
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setIsInviteDialogOpen(true)}
              >
                <UserPlus className="h-4 w-4" />
                Invite
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            {/* Members */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Members ({groupMembers.length})</h4>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsInviteDialogOpen(true)}
                >
                  <UserPlus className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-2">
                {groupMembers.map((user) => (
                  <Card key={user!.id} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <UserAvatar user={user!} size="sm" />
                          <div>
                            <p className="font-medium text-sm">{user!.name}</p>
                            <p className="text-xs text-muted-foreground">{user!.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onChatWithMember(user!.id)}
                          >
                            <MessageCircle className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div>
              <h4 className="font-semibold mb-3">Group Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">12</p>
                  <p className="text-xs text-muted-foreground">Active Tasks</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">8</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite Member Dialog */}
      <InviteMemberDialog
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        groupId={groupId}
        groupName={group.name}
      />
    </>
  );
}