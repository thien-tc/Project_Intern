import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function ActiveGoals() {
  const { state } = useApp();

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Active Goals
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {state.goals.map((goal) => (
            <div key={goal.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm">{goal.title}</h4>
                  <p className="text-xs text-muted-foreground">{goal.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{goal.progress}%</p>
                </div>
              </div>
              
              <Progress value={goal.progress} className="h-2" />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{goal.linkedTasks.length} linked tasks</span>
                <span>Due {new Date(goal.targetDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}