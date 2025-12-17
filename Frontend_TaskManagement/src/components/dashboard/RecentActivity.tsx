import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/common/UserAvatar';
// import { PriorityBadge } from '@/components/common/PriorityBadge';
import { useApp } from '@/context/AppContext';
import { formatDistanceToNow } from 'date-fns';

export function RecentActivity() {
  const { state } = useApp();

  const getUser = (userId: string) => {
    return state.users.find(user => user.id === userId);
  };

  const getTask = (taskId: string) => {
    return state.tasks.find(task => task.id === taskId);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button variant="ghost" size="sm">View Task</Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {state.activities.slice(0, 5).map((activity) => {
            const user = getUser(activity.userId);
            const task = getTask(activity.taskId);

            if (!user || !task) return null;

            return (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <UserAvatar user={user} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{user.name}</span>
                    <span className="text-sm text-muted-foreground">{activity.description}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
                    {/* {activity.priority && <PriorityBadge priority={activity.priority} showIcon={false} />} */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}