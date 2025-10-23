import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal, MessageCircle, Calendar, Flag, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { UserAvatar } from '@/components/common/UserAvatar';
import type { Task } from '@/services/mockData';

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
}

function TaskCard({ task, onTaskClick }: TaskCardProps) {
  const { state } = useApp();
  
  const assignedUsers = task.assignees.map(id => 
    state.users.find(user => user.id === id)
  ).filter(Boolean);

  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <Card 
      className="mb-3 cursor-pointer hover:shadow-md transition-shadow group"
      onClick={() => onTaskClick(task)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-medium text-sm leading-tight flex-1 pr-2">
            {task.title}
          </h4>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>

        {/* Task Meta */}
        <div className="space-y-2">
          {/* Priority and Status */}
          <div className="flex items-center gap-2">
            <PriorityBadge priority={task.priority} showIcon={false} />
            {task.dueDate && (
              <Badge variant="outline" className="text-xs">
                <Calendar className="mr-1 h-3 w-3" />
                {new Date(task.dueDate).toLocaleDateString()}
              </Badge>
            )}
          </div>

          {/* Subtasks Progress */}
          {totalSubtasks > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex-1 bg-muted rounded-full h-1">
                <div 
                  className="bg-primary h-1 rounded-full transition-all"
                  style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                />
              </div>
              <span>{completedSubtasks}/{totalSubtasks}</span>
            </div>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {task.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{task.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1">
              {assignedUsers.slice(0, 3).map(user => (
                <UserAvatar key={user!.id} user={user!} size="sm" />
              ))}
              {assignedUsers.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                  +{assignedUsers.length - 3}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              {task.comments.length > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <MessageCircle className="h-3 w-3" />
                  {task.comments.length}
                </div>
              )}
              {task.timeTracked > 0 && (
                <div className="text-xs">
                  {Math.floor(task.timeTracked / 60)}h {task.timeTracked % 60}m
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TaskBoardProps {
  onTaskClick: (task: Task) => void;
}

export function TaskBoard({ onTaskClick }: TaskBoardProps) {
  const { state } = useApp();
  
  const statusColumns = [
    { key: 'todo', title: 'TO DO', color: 'bg-gray-500' },
    { key: 'in_progress', title: 'IN PROGRESS', color: 'bg-blue-500' },
    { key: 'review', title: 'REVIEW', color: 'bg-yellow-500' },
    { key: 'completed', title: 'COMPLETE', color: 'bg-green-500' }
  ] as const;

  const getTasksByStatus = (status: string) => {
    return state.tasks.filter(task => task.status === status);
  };

  return (
    <div className="flex gap-6 h-full overflow-x-auto pb-6">
      {statusColumns.map(column => {
        const tasks = getTasksByStatus(column.key);
        
        return (
          <div key={column.key} className="flex-shrink-0 w-80">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h3 className="font-semibold text-sm uppercase tracking-wide">
                  {column.title}
                </h3>
                <Badge variant="secondary" className="ml-auto">
                  {tasks.length}
                </Badge>
              </div>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start text-primary hover:text-primary-foreground hover:bg-primary"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>

            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
              {tasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onTaskClick={onTaskClick}
                />
              ))}
            </div>
          </div>
        );
      })}
      
      {/* Add Group Column */}
      <div className="flex-shrink-0 w-80">
        <Button 
          variant="outline" 
          className="w-full h-12 border-dashed"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add group
        </Button>
      </div>
    </div>
  );
}