import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  MoreHorizontal,
  Calendar,
  MessageCircle,
  Paperclip,
  Flag,
  Clock,
  Plus
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { UserAvatar } from '@/components/common/UserAvatar';

import type { Task } from '@/services/mockData';

interface TaskListProps {
  onTaskClick: (task: Task) => void;
}

export function TaskList({ onTaskClick }: TaskListProps) {
  const { state, dispatch } = useApp();
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const toggleTaskComplete = (task: Task) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        id: task.id,
        updates: { status: newStatus }
      }
    });
  };

  const getAssignedUsers = (task: Task) => {
    return task.assignees.map(id =>
      state.users.find(user => user.id === id)
    ).filter(Boolean);
  };

  return (
    <div className="space-y-4">
      {/* Add Task Button */}
      <Button className="w-full justify-start gap-2 mb-4">
        <Plus className="h-4 w-4" />
        Add Task
      </Button>

      {/* Task List */}
      <div className="space-y-2">
        {state.tasks.map(task => {
          const assignedUsers = getAssignedUsers(task);
          const completedSubtasks = task.subtasks.filter(st => st.completed).length;
          const totalSubtasks = task.subtasks.length;

          return (
            <Card
              key={task.id}
              className={`hover:shadow-sm transition-shadow cursor-pointer group ${selectedTasks.includes(task.id) ? 'ring-2 ring-primary' : ''
                }`}
              onClick={() => onTaskClick(task)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  <Checkbox
                    checked={task.status === 'completed'}
                    onCheckedChange={() => toggleTaskComplete(task)}
                    onClick={(e) => e.stopPropagation()}
                  />

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className={`font-medium text-sm ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                        }`}>
                        {task.title}
                      </h4>

                      {/* Priority */}
                      {/* <PriorityBadge priority={task.priority} showIcon={false} /> */}

                      {/* Status */}
                      {/* <StatusBadge status={task.status} showIcon={false} /> */}
                    </div>

                    {/* Task Meta */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {/* Due Date */}
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}

                      {/* Subtasks */}
                      {totalSubtasks > 0 && (
                        <div className="flex items-center gap-1">
                          <Checkbox className="h-3 w-3" />
                          {completedSubtasks}/{totalSubtasks}
                        </div>
                      )}

                      {/* Comments */}
                      {task.comments.length > 0 && (
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {task.comments.length}
                        </div>
                      )}

                      {/* Attachments */}
                      {task.attachments.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Paperclip className="h-3 w-3" />
                          {task.attachments.length}
                        </div>
                      )}

                      {/* Time Tracked */}
                      {task.timeTracked > 0 && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {Math.floor(task.timeTracked / 60)}h {task.timeTracked % 60}m
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {task.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Assignees */}
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {assignedUsers.slice(0, 3).map(user => (
                        <UserAvatar key={user!.id} user={user!} size="sm" />
                      ))}
                      {assignedUsers.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                          +{assignedUsers.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}