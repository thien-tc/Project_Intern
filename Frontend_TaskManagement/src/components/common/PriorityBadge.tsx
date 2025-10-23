import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ArrowUp, Minus, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: 'urgent' | 'high' | 'normal' | 'low';
  showIcon?: boolean;
}

export function PriorityBadge({ priority, showIcon = true }: PriorityBadgeProps) {
  const config = {
    urgent: {
      label: 'Urgent',
      variant: 'destructive' as const,
      icon: AlertTriangle,
      className: 'bg-red-500 hover:bg-red-600 text-white'
    },
    high: {
      label: 'High',
      variant: 'secondary' as const,
      icon: ArrowUp,
      className: 'bg-orange-500 hover:bg-orange-600 text-white'
    },
    normal: {
      label: 'Normal',
      variant: 'outline' as const,
      icon: Minus,
      className: 'bg-blue-500 hover:bg-blue-600 text-white'
    },
    low: {
      label: 'Low',
      variant: 'secondary' as const,
      icon: ArrowDown,
      className: 'bg-gray-500 hover:bg-gray-600 text-white'
    }
  };

  const { label, icon: Icon, className } = config[priority];

  return (
    <Badge className={className}>
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {label}
    </Badge>
  );
}