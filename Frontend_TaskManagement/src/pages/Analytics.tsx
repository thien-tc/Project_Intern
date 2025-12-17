import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Analytics() {
  const { state } = useApp();

  // Calculate analytics data
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(task => task.status === 'completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const priorityDistribution = {
    urgent: state.tasks.filter(task => task.priority === 'urgent').length,
    high: state.tasks.filter(task => task.priority === 'high').length,
    normal: state.tasks.filter(task => task.priority === 'normal').length,
    low: state.tasks.filter(task => task.priority === 'low').length,
  };

  const statusDistribution = {
    todo: state.tasks.filter(task => task.status === 'todo').length,
    in_progress: state.tasks.filter(task => task.status === 'in_progress').length,
    review: state.tasks.filter(task => task.status === 'review').length,
    completed: state.tasks.filter(task => task.status === 'completed').length,
  };

  const userTaskCounts = state.users.map(user => ({
    user,
    taskCount: state.tasks.filter(task => task.assignees.includes(user.id)).length
  }));

  return (
    <MainLayout
      title="Analytics"
      subtitle="Track your team's performance and productivity."
    >
      <div className="p-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completionRate}%</p>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalTasks}</p>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{state.users.length}</p>
                  <p className="text-sm text-muted-foreground">Team Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {Math.floor(state.timeEntries.reduce((sum, entry) => sum + entry.duration, 0) / 60)}h
                  </p>
                  <p className="text-sm text-muted-foreground">Time Logged</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Priority Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(priorityDistribution).map(([priority, count]) => (
                <div key={priority} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{priority}</span>
                    <span>{count} tasks</span>
                  </div>
                  <Progress
                    value={totalTasks > 0 ? (count / totalTasks) * 100 : 0}
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(statusDistribution).map(([status, count]) => (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{status.replace('_', ' ')}</span>
                    <span>{count} tasks</span>
                  </div>
                  <Progress
                    value={totalTasks > 0 ? (count / totalTasks) * 100 : 0}
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userTaskCounts.map(({ user, taskCount }) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{taskCount} tasks</p>
                    <p className="text-xs text-muted-foreground">
                      {totalTasks > 0 ? Math.round((taskCount / totalTasks) * 100) : 0}% of total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}