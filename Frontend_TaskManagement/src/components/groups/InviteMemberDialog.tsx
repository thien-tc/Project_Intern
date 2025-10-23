import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  UserPlus, 
  Mail, 
  User, 
  X, 
  Search,
  Check,
  AlertCircle
} from 'lucide-react';
import { UserAvatar } from '@/components/common/UserAvatar';
import { useApp } from '@/context/AppContext';

interface InviteMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
}

type UserRole = 'member' | 'admin' | 'viewer';

interface InviteData {
  identifier: string; // email or username
  role: UserRole;
  type: 'email' | 'username';
}

interface SearchResult {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  isAlreadyMember: boolean;
}

export function InviteMemberDialog({ 
  isOpen, 
  onClose, 
  groupId, 
  groupName 
}: InviteMemberDialogProps) {
  const { state } = useApp();
  const [inviteList, setInviteList] = useState<InviteData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('member');

  // Mock search function - in real app, this would call an API
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '4',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          username: 'alice_j',
          isAlreadyMember: false
        },
        {
          id: '5',
          name: 'Bob Wilson',
          email: 'bob@example.com',
          username: 'bob_w',
          isAlreadyMember: true
        },
        {
          id: '6',
          name: 'Carol Brown',
          email: 'carol@example.com',
          username: 'carol_b',
          isAlreadyMember: false
        }
      ].filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 500);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidUsername = (username: string) => {
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
  };

  const addToInviteList = (identifier: string, type: 'email' | 'username') => {
    if (inviteList.some(invite => invite.identifier === identifier)) {
      return; // Already in list
    }

    const newInvite: InviteData = {
      identifier,
      role: selectedRole,
      type
    };

    setInviteList([...inviteList, newInvite]);
    setCurrentInput('');
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeFromInviteList = (identifier: string) => {
    setInviteList(inviteList.filter(invite => invite.identifier !== identifier));
  };

  const handleAddByInput = () => {
    const input = currentInput.trim();
    if (!input) return;

    if (isValidEmail(input)) {
      addToInviteList(input, 'email');
    } else if (isValidUsername(input)) {
      addToInviteList(input, 'username');
    }
  };

  const handleAddFromSearch = (user: SearchResult) => {
    if (user.isAlreadyMember) return;
    addToInviteList(user.email, 'email');
  };

  const handleSendInvites = () => {
    if (inviteList.length === 0) return;

    // Here you would typically send the invites via API
    console.log('Sending invites:', inviteList);
    
    // Show success message and close dialog
    alert(`Sent ${inviteList.length} invite(s) to ${groupName}!`);
    setInviteList([]);
    onClose();
  };

  const updateRole = (identifier: string, role: UserRole) => {
    setInviteList(inviteList.map(invite => 
      invite.identifier === identifier ? { ...invite, role } : invite
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Members to {groupName}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search Users</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4">
            <div className="space-y-2">
              <Label>Search by name, email, or username</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchUsers(e.target.value);
                  }}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <Label className="text-sm text-muted-foreground">Search Results</Label>
                {searchResults.map((user) => (
                  <Card key={user.id} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <UserAvatar 
                            user={{
                              id: user.id,
                              name: user.name,
                              email: user.email,
                              avatar: user.avatar || '/default-avatar.png',
                              role: 'member'
                            }} 
                            size="sm" 
                          />
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              @{user.username} • {user.email}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {user.isAlreadyMember ? (
                            <Badge variant="secondary">Already Member</Badge>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={() => handleAddFromSearch(user)}
                            >
                              <UserPlus className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {isSearching && (
              <div className="text-center py-4 text-muted-foreground">
                Searching...
              </div>
            )}
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Email or Username</Label>
                  <Input
                    placeholder="user@example.com or username"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddByInput();
                      }
                    }}
                  />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>Email format: user@domain.com</span>
                    <User className="h-3 w-3 ml-2" />
                    <span>Username: 3-20 characters, letters, numbers, underscore</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleAddByInput}
                disabled={!currentInput.trim() || (!isValidEmail(currentInput) && !isValidUsername(currentInput))}
                className="w-full"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add to Invite List
              </Button>

              {currentInput.trim() && !isValidEmail(currentInput) && !isValidUsername(currentInput) && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  Please enter a valid email or username
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Invite List */}
        {inviteList.length > 0 && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                Pending Invites ({inviteList.length})
              </Label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setInviteList([])}
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {inviteList.map((invite, index) => (
                <Card key={index}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          {invite.type === 'email' ? 
                            <Mail className="h-4 w-4" /> : 
                            <User className="h-4 w-4" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-sm">{invite.identifier}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {invite.type} • {invite.role}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Select 
                          value={invite.role} 
                          onValueChange={(value: UserRole) => updateRole(invite.identifier, value)}
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="viewer">Viewer</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromInviteList(invite.identifier)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendInvites}
            disabled={inviteList.length === 0}
            className="gap-2"
          >
            <Mail className="h-4 w-4" />
            Send {inviteList.length} Invite{inviteList.length !== 1 ? 's' : ''}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}