import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, FolderOpen, Users, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function StatsCards() {
  const { state } = useApp();
  
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(task => task.status === 'completed').length;
  const activeProjects = state.projects.filter(project => project.progress < 100).length;
  const teamMembers = state.users.length;
  const totalTimeLogged = state.timeEntries.reduce((total, entry) => total + entry.duration, 0);
  const avgTimePerTask = totalTimeLogged > 0 ? Math.round(totalTimeLogged / totalTasks) : 0;

  const stats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      subtitle: `${completedTasks} completed`,
      icon: CheckCircle,
      color: 'text-blue-600'
    },
    {
      title: 'Active Projects',
      value: activeProjects,
      subtitle: `${activeProjects} active`,
      icon: FolderOpen,
      color: 'text-green-600'
    },
    {
      title: 'Team Members',
      value: teamMembers,
      subtitle: `${teamMembers} online`,
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Time Logged',
      value: `${Math.floor(totalTimeLogged / 60)}h`,
      subtitle: `${avgTimePerTask}m avg per task`,
      icon: Clock,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </div>
              <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}