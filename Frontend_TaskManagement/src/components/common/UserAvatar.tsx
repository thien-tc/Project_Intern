import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  user?: {
    name: string;
    avatar?: string;
  } | null;
  // cac props du phong neu khong truyen object user
  name?: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  className?: string;// Them classNam de de custom ben ngoai neu can
}

export function UserAvatar({ user, name, avatarUrl, size = 'md', showName = false }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 text-[10px]',
    md: 'h-8 w-8 text-xs',
    lg: 'h-10 w-10 text-sm',
    xl: 'h-32 w-32 text-4xl'
  };
  const finalName = user?.name || name || "unknown";
  const finalAvatarUrl = user?.avatar || avatarUrl || "";


  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 1);
  };

  return (
    <div className="flex items-center gap-2">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={finalAvatarUrl} alt={finalName} className="object-cover" />
        <AvatarFallback className="font-medium">
          {getInitials(finalName)}
        </AvatarFallback>
      </Avatar>
      {showName && (
        <span className="text-sm font-medium">{finalName}</span>
      )}
    </div>
  );
}