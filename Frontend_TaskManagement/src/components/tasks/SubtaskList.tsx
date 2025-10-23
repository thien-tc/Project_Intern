import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  MoreHorizontal,
  Calendar,
  User
} from 'lucide-react';
import { UserAvatar } from '@/components/common/UserAvatar';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { useApp } from '@/context/AppContext';
import type { Task, Subtask } from '@/services/mockData';

interface SubtaskListProps {
  task: Task;
  onSubtaskUpdate: (subtaskId: string, updates: Partial<Subtask>) => void;
}

export function SubtaskList({ task, onSubtaskUpdate }: SubtaskListProps) {
  const { state } = useApp();
  const [isExpanded, setIsExpanded] = useState(true);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const totalSubtasks = task.subtasks.length;
  const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const getUser = (userId: string) => {
    return state.users.find(user => user.id === userId);
  };

  const handleSubtaskToggle = (subtaskId: string, completed: boolean) => {
    onSubtaskUpdate(subtaskId, { completed });
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    
    // Here you would typically dispatch an action to add the subtask
    console.log('Adding subtask:', newSubtaskTitle);
    setNewSubtaskTitle('');
    setShowAddForm(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </Button>
            <CardTitle className="text-base">
              Subtasks ({completedSubtasks}/{totalSubtasks})
            </CardTitle>
          </div>
          
          <div className="flex items-center gap-2">
            <Progress value={progress} className="w-20 h-2" />
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Existing Subtasks */}
            {task.subtasks.map((subtask) => {
              const assignee = subtask.assigneeId ? getUser(subtask.assigneeId) : null;
              
              return (
                <div 
                  key={subtask.id} 
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                >
                  <Checkbox
                    checked={subtask.completed}
                    onCheckedChange={(checked) => 
                      handleSubtaskToggle(subtask.id, checked as boolean)
                    }
                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      subtask.completed ? 'line-through text-muted-foreground' : ''
                    }`}>
                      {subtask.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {assignee && (
                      <UserAvatar user={assignee} size="sm" />
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}

            {/* Add New Subtask Form */}
            {showAddForm && (
              <div className="flex items-center gap-2 p-3 rounded-lg border border-dashed">
                <Checkbox disabled />
                <Input
                  placeholder="Enter subtask title..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSubtask();
                    }
                    if (e.key === 'Escape') {
                      setShowAddForm(false);
                      setNewSubtaskTitle('');
                    }
                  }}
                  className="flex-1"
                  autoFocus
                />
                <Button size="sm" onClick={handleAddSubtask}>
                  Add
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShowAddForm(false);
                    setNewSubtaskTitle('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}

            {/* Add Subtask Button */}
            {!showAddForm && (
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Subtask
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}