import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Maximize2,
  Phone,
  Video,
  MoreHorizontal
} from 'lucide-react';
import { UserAvatar } from '../../components/common/UserAvatar';
import { useApp } from '../../context/AppContext';

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
}

interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  chatId?: string;
  chatName?: string;
}

export function ChatPopup({ isOpen, onClose, chatId, chatName = "Team Chat" }: ChatPopupProps) {
  const { state } = useApp();
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Mock chat messages
  const [messages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: '2',
      content: 'Hey team! How\'s the progress on the authentication task?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: 'text'
    },
    {
      id: '2',
      senderId: '1',
      content: 'Going well! Just finished the JWT implementation. Should be ready for review soon.',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      type: 'text'
    },
    {
      id: '3',
      senderId: '3',
      content: 'Great! I can help with the testing once it\'s ready.',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      type: 'text'
    },
    {
      id: '4',
      senderId: '1',
      content: 'Perfect! I\'ll ping you when it\'s deployed to staging.',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      type: 'text'
    }
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    // Here you would typically dispatch to add the message
    console.log('Sending message:', message);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getUser = (userId: string) => {
    return state.users.find(user => user.id === userId);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`w-80 shadow-lg transition-all duration-200 ${
        isMinimized ? 'h-14' : 'h-96'
      }`}>
        <CardHeader className="p-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              </div>
              <div>
                <CardTitle className="text-sm">{chatName}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {state.users.length} members online
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Phone className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Video className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={onClose}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            {/* Messages */}
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {messages.map(msg => {
                  const user = getUser(msg.senderId);
                  const isCurrentUser = msg.senderId === state.currentUser.id;
                  
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex gap-2 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                    >
                      <UserAvatar user={user!} size="sm" />
                      <div className={`flex-1 ${isCurrentUser ? 'text-right' : ''}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">{user?.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                        <div className={`inline-block p-2 rounded-lg text-sm max-w-[200px] ${
                          isCurrentUser 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button size="sm" onClick={sendMessage} disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}