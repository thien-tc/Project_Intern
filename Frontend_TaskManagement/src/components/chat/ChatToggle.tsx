import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { ChatPopup } from './ChatPopup';
import { useLocation } from 'react-router-dom';

export function ChatToggle() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();

  // Không hiển thị chat toggle nếu đang ở trang chat
  if (location.pathname === '/chat') {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <ChatPopup
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
}