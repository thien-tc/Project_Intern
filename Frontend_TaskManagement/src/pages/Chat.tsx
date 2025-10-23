import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Send, 
  Phone,
  Video,
  MoreHorizontal,
  Users,
  Search,
  Plus
} from 'lucide-react';
import { UserAvatar } from '@/components/common/UserAvatar';
import { useApp } from '@/context/AppContext';

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
}

interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isOnline?: boolean;
}

export default function Chat() {
  const { state } = useApp();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock chats data
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Development Team',
      type: 'group',
      participants: ['1', '2', '3'],
      lastMessage: {
        id: '1',
        senderId: '2',
        content: 'Hey team! How\'s the progress on the authentication task?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        type: 'text'
      },
      unreadCount: 2
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      type: 'direct',
      participants: ['1', '2'],
      lastMessage: {
        id: '2',
        senderId: '2',
        content: 'Can you review the UI mockups?',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        type: 'text'
      },
      unreadCount: 1,
      isOnline: true
    },
    {
      id: '3',
      name: 'Mike Johnson',
      type: 'direct',
      participants: ['1', '3'],
      lastMessage: {
        id: '3',
        senderId: '3',
        content: 'Thanks for the feedback!',
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        type: 'text'
      },
      unreadCount: 0,
      isOnline: false
    }
  ]);

  // Mock messages for selected chat
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
    if (!message.trim() || !selectedChat) return;
    
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
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hôm nay';
    if (days === 1) return 'Hôm qua';
    if (days < 7) return `${days} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  };

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout 
      title="Chat"
      subtitle="Giao tiếp với nhóm và thành viên"
    >
      <div className="flex h-full">
        {/* Chat List */}
        <div className="w-80 border-r border-border flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm kiếm cuộc trò chuyện..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Chat Tabs */}
          <Tabs defaultValue="all" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 m-4 mb-0">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="groups">Nhóm</TabsTrigger>
              <TabsTrigger value="direct">Cá nhân</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="flex-1 m-0">
              <ScrollArea className="h-full">
                <div className="p-2">
                  {filteredChats.map((chat) => {
                    const isGroup = chat.type === 'group';
                    const otherUser = isGroup ? null : getUser(chat.participants.find(id => id !== state.currentUser.id)!);
                    
                    return (
                      <Button
                        key={chat.id}
                        variant={selectedChat === chat.id ? "secondary" : "ghost"}
                        className="w-full justify-start p-3 h-auto mb-1"
                        onClick={() => setSelectedChat(chat.id)}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className="relative">
                            {isGroup ? (
                              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                <Users className="h-5 w-5 text-primary-foreground" />
                              </div>
                            ) : (
                              <UserAvatar user={otherUser!} size="md" />
                            )}
                            {!isGroup && chat.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                            )}
                          </div>
                          
                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{chat.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {chat.lastMessage && formatTime(chat.lastMessage.timestamp)}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                                {chat.lastMessage?.content || 'Chưa có tin nhắn'}
                              </p>
                              {chat.unreadCount > 0 && (
                                <Badge variant="destructive" className="h-5 px-2 text-xs">
                                  {chat.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="groups" className="flex-1 m-0">
              <ScrollArea className="h-full">
                <div className="p-2">
                  {filteredChats.filter(chat => chat.type === 'group').map((chat) => (
                    <Button
                      key={chat.id}
                      variant={selectedChat === chat.id ? "secondary" : "ghost"}
                      className="w-full justify-start p-3 h-auto mb-1"
                      onClick={() => setSelectedChat(chat.id)}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary-foreground" />
                        </div>
                        
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{chat.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {chat.lastMessage && formatTime(chat.lastMessage.timestamp)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                              {chat.participants.length} thành viên
                            </p>
                            {chat.unreadCount > 0 && (
                              <Badge variant="destructive" className="h-5 px-2 text-xs">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="direct" className="flex-1 m-0">
              <ScrollArea className="h-full">
                <div className="p-2">
                  {filteredChats.filter(chat => chat.type === 'direct').map((chat) => {
                    const otherUser = getUser(chat.participants.find(id => id !== state.currentUser.id)!);
                    
                    return (
                      <Button
                        key={chat.id}
                        variant={selectedChat === chat.id ? "secondary" : "ghost"}
                        className="w-full justify-start p-3 h-auto mb-1"
                        onClick={() => setSelectedChat(chat.id)}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className="relative">
                            <UserAvatar user={otherUser!} size="md" />
                            {chat.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                            )}
                          </div>
                          
                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{otherUser?.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {chat.lastMessage && formatTime(chat.lastMessage.timestamp)}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                                {chat.lastMessage?.content || 'Chưa có tin nhắn'}
                              </p>
                              {chat.unreadCount > 0 && (
                                <Badge variant="destructive" className="h-5 px-2 text-xs">
                                  {chat.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChatData ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {selectedChatData.type === 'group' ? (
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary-foreground" />
                        </div>
                      ) : (
                        <UserAvatar user={getUser(selectedChatData.participants.find(id => id !== state.currentUser.id)!)!} size="md" />
                      )}
                      {selectedChatData.type === 'direct' && selectedChatData.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">{selectedChatData.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedChatData.type === 'group' 
                          ? `${selectedChatData.participants.length} thành viên`
                          : selectedChatData.isOnline ? 'Đang hoạt động' : 'Offline'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map(msg => {
                    const user = getUser(msg.senderId);
                    const isCurrentUser = msg.senderId === state.currentUser.id;
                    
                    return (
                      <div 
                        key={msg.id} 
                        className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                      >
                        <UserAvatar user={user!} size="sm" />
                        <div className={`flex-1 max-w-[70%] ${isCurrentUser ? 'text-right' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{user?.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                          <div className={`inline-block p-3 rounded-lg text-sm ${
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
              <div className="p-4 border-t border-border">
                <div className="flex gap-3">
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Chọn một cuộc trò chuyện</h3>
                <p className="text-muted-foreground">
                  Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}