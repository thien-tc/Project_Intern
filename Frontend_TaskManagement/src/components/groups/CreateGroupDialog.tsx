import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  X, 
  Plus,
  Palette,
  Lock,
  Globe,
  UserPlus
} from 'lucide-react';

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

interface CreateGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: (group: Group) => void;
}

export function CreateGroupDialog({ 
  isOpen, 
  onClose, 
  onGroupCreated 
}: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');

  const colorOptions = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Teal', value: '#14b8a6' }
  ];

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const addEmail = () => {
    const email = currentEmail.trim();
    if (email && isValidEmail(email) && !inviteEmails.includes(email)) {
      setInviteEmails([...inviteEmails, email]);
      setCurrentEmail('');
    }
  };

  const removeEmail = (email: string) => {
    setInviteEmails(inviteEmails.filter(e => e !== email));
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;

    const newGroup: Group = {
      id: Date.now().toString(),
      name: groupName.trim(),
      description: description.trim(),
      color: selectedColor,
      privacy,
      inviteEmails,
      memberCount: inviteEmails.length + 1, // +1 for creator
      members: ['current-user'], // Creator is automatically a member
      createdAt: new Date().toISOString()
    };

    onGroupCreated(newGroup);
    
    // Reset form
    setGroupName('');
    setDescription('');
    setPrivacy('public');
    setSelectedColor('#3b82f6');
    setInviteEmails([]);
    setCurrentEmail('');
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Create New Group
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">Group Name *</Label>
              <Input
                id="group-name"
                placeholder="Enter group name..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground">
                {groupName.length}/50 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What's this group about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/200 characters
              </p>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-3">
            <Label>Privacy</Label>
            <div className="grid grid-cols-2 gap-3">
              <Card 
                className={`cursor-pointer transition-colors ${
                  privacy === 'public' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setPrivacy('public')}
              >
                <CardContent className="p-4 text-center">
                  <Globe className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-medium text-sm">Public</p>
                  <p className="text-xs text-muted-foreground">
                    Anyone can find and join
                  </p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-colors ${
                  privacy === 'private' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setPrivacy('private')}
              >
                <CardContent className="p-4 text-center">
                  <Lock className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-medium text-sm">Private</p>
                  <p className="text-xs text-muted-foreground">
                    Invite only
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Group Color
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((color) => (
                <Button
                  key={color.value}
                  variant="outline"
                  className={`h-12 p-2 ${
                    selectedColor === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedColor(color.value)}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="text-xs">{color.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Invite Members */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Members (Optional)
            </Label>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter email address..."
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addEmail();
                  }
                }}
              />
              <Button 
                onClick={addEmail}
                disabled={!currentEmail.trim() || !isValidEmail(currentEmail)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {inviteEmails.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Invited Members ({inviteEmails.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {inviteEmails.map((email) => (
                    <Badge key={email} variant="secondary" className="gap-1">
                      {email}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeEmail(email)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: selectedColor }}
                  >
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{groupName || 'Group Name'}</p>
                    <p className="text-sm text-muted-foreground">
                      {inviteEmails.length + 1} member{inviteEmails.length !== 0 ? 's' : ''} • {privacy}
                    </p>
                  </div>
                </div>
                {description && (
                  <p className="text-sm text-muted-foreground mt-2">{description}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateGroup}
            disabled={!groupName.trim()}
          >
            Create Group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}