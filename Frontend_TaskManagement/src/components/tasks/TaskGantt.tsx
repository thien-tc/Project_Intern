import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { UserAvatar } from '@/components/common/UserAvatar';
import { PriorityBadge } from '@/components/common/PriorityBadge';

interface GanttTask {
  id: string;
  title: string;
  assignee: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  progress: number;
  startDate: Date;
  endDate: Date;
  dependencies: string[];
}

export function TaskGantt() {
  const { state } = useApp();
  
  // Mock Gantt data based on tasks
  const ganttTasks: GanttTask[] = [
    {
      id: '1',
      title: 'Project Planning',
      assignee: '1',
      priority: 'high',
      progress: 100,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-08'),
      dependencies: []
    },
    {
      id: '2',
      title: 'Design Phase',
      assignee: '2',
      priority: 'normal',
      progress: 75,
      startDate: new Date('2024-01-08'),
      endDate: new Date('2024-01-22'),
      dependencies: ['1']
    },
    {
      id: '3',
      title: 'Development Phase',
      assignee: '3',
      priority: 'urgent',
      progress: 30,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-26'),
      dependencies: ['2']
    },
    {
      id: '4',
      title: 'Testing & QA',
      assignee: '1',
      priority: 'high',
      progress: 0,
      startDate: new Date('2024-02-10'),
      endDate: new Date('2024-02-25'),
      dependencies: ['3']
    }
  ];

  const getUser = (userId: string) => {
    return state.users.find(user => user.id === userId);
  };

  const generateTimelineHeaders = () => {
    const headers = [];
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-02-26');
    
    const current = new Date(startDate);
    while (current <= endDate) {
      headers.push(new Date(current));
      current.setDate(current.getDate() + 7); // Weekly intervals
    }
    
    return headers;
  };

  const calculateBarPosition = (task: GanttTask, timelineStart: Date, timelineEnd: Date) => {
    const totalDays = Math.ceil((timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
    const taskStartDays = Math.ceil((task.startDate.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
    const taskDuration = Math.ceil((task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const leftPercent = (taskStartDays / totalDays) * 100;
    const widthPercent = (taskDuration / totalDays) * 100;
    
    return { left: `${leftPercent}%`, width: `${widthPercent}%` };
  };

  const timelineHeaders = generateTimelineHeaders();
  const timelineStart = new Date('2024-01-01');
  const timelineEnd = new Date('2024-02-26');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Gantt Chart
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Visualize project timeline and dependencies
              </p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Project Timeline */}
            <div>
              <h3 className="font-semibold mb-4">Project Timeline</h3>
              
              {/* Timeline Header */}
              <div className="flex mb-4">
                <div className="w-80 flex-shrink-0"></div>
                <div className="flex-1 grid grid-cols-8 gap-1 text-xs text-muted-foreground">
                  {timelineHeaders.map((date, index) => (
                    <div key={index} className="text-center">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Gantt Bars */}
              <div className="space-y-3">
                {ganttTasks.map(task => {
                  const user = getUser(task.assignee);
                  const barPosition = calculateBarPosition(task, timelineStart, timelineEnd);
                  
                  return (
                    <div key={task.id} className="flex items-center">
                      {/* Task Info */}
                      <div className="w-80 flex-shrink-0 flex items-center gap-3 pr-4">
                        <UserAvatar user={user!} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{task.title}</p>
                          <div className="flex items-center gap-2">
                            <PriorityBadge priority={task.priority} showIcon={false} />
                            <span className="text-xs text-muted-foreground">
                              {task.progress}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Timeline Bar */}
                      <div className="flex-1 relative h-8 bg-muted rounded">
                        <div
                          className="absolute top-1 bottom-1 bg-primary rounded flex items-center justify-center"
                          style={barPosition}
                        >
                          <span className="text-xs text-primary-foreground font-medium">
                            {task.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Task Dependencies */}
            <div>
              <h3 className="font-semibold mb-4">Task Dependencies</h3>
              <div className="space-y-3">
                {ganttTasks.filter(task => task.dependencies.length > 0).map(task => {
                  const dependentTask = ganttTasks.find(t => t.id === task.dependencies[0]);
                  
                  return (
                    <div key={task.id} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            Depends on: {dependentTask?.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {task.startDate.toLocaleDateString()} - {task.endDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}