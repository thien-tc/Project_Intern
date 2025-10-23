import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/services/mockData';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export function UserAvatar({ user, size = 'md', showName = false }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex items-center gap-2">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="text-xs font-medium">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      {showName && (
        <span className="text-sm font-medium">{user.name}</span>
      )}
    </div>
  );
}