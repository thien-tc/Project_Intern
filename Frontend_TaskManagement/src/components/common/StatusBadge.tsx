import { Badge } from '@/components/ui/badge';
import { Circle, Clock, Eye, CheckCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  showIcon?: boolean;
}

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const config = {
    todo: {
      label: 'To Do',
      icon: Circle,
      className: 'bg-gray-500 hover:bg-gray-600 text-white'
    },
    in_progress: {
      label: 'In Progress',
      icon: Clock,
      className: 'bg-blue-500 hover:bg-blue-600 text-white'
    },
    review: {
      label: 'Review',
      icon: Eye,
      className: 'bg-yellow-500 hover:bg-yellow-600 text-white'
    },
    completed: {
      label: 'Completed',
      icon: CheckCircle,
      className: 'bg-green-500 hover:bg-green-600 text-white'
    }
  };

  const { label, icon: Icon, className } = config[status];

  return (
    <Badge className={className}>
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {label}
    </Badge>
  );
}